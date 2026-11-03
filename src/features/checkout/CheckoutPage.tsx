import React, { useEffect, useRef, useState } from "react";
import {
  IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader,
  IonCardTitle, IonCheckbox, IonContent, IonHeader, IonInput, IonItem, IonLabel,
  IonList, IonLoading, IonNote, IonPage, IonSegment, IonSegmentButton, IonTextarea,
  IonTitle, IonToolbar,
} from "@ionic/react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { apiService } from "@services/api";
import { storageService } from "@services/storage";
import { toast } from "@services/toast";
import { useAuthStore } from "@store/auth.store";
import { useCartStore } from "@store/cart.store";
import { formatCurrency } from "@utils/currency";
import { createSingleFlight } from "@utils/singleFlight";
import { storefrontPath } from "@features/storefront/storefrontPath";

const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.getTotal());
  const clearCart = useCartStore((state) => state.clearCart);
  const { isAuthenticated, customer, login } = useAuthStore();
  const storefront = storageService.getStorefront();
  const [name, setName] = useState(customer?.name ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [fulfillment, setFulfillment] = useState<"PICKUP" | "DELIVERY">("PICKUP");
  const savedAddress = customer?.addresses?.[0];
  const [addressLine1, setAddressLine1] = useState(savedAddress?.address_line1 ?? "");
  const [addressLine2, setAddressLine2] = useState(savedAddress?.address_line2 ?? "");
  const [landmark, setLandmark] = useState(savedAddress?.landmark ?? "");
  const [city, setCity] = useState(savedAddress?.city ?? "");
  const [postalCode, setPostalCode] = useState(savedAddress?.postal_code ?? "");
  const [saveAddress, setSaveAddress] = useState(true);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const otpSubmission = useRef(createSingleFlight());

  useEffect(() => {
    const address = customer?.addresses?.[0];
    if (!address) return;
    setAddressLine1(address.address_line1);
    setAddressLine2(address.address_line2 ?? "");
    setLandmark(address.landmark ?? "");
    setCity(address.city ?? "");
    setPostalCode(address.postal_code ?? "");
  }, [customer]);

  const requestOtp = () => otpSubmission.current.run(async () => {
    if (!/^\d{10}$/.test(phone) || name.trim().length < 2) {
      toast.error(t("checkout_identity_required"));
      return;
    }
    setLoading(true);
    try {
      const response = await apiService.requestOtp(phone);
      setOtpRequested(true);
      if (response.data?.debugOtp) setOtp(response.data.debugOtp);
      toast.success(t("otp_sent"));
    } catch {
      // The API interceptor presents the server's actionable error message.
    } finally { setLoading(false); }
  });

  const verifyOtp = () => otpSubmission.current.run(async () => {
    if (!/^\d{6}$/.test(otp)) {
      toast.error(t("verification_code_required"));
      return;
    }
    setLoading(true);
    try {
      const response = await apiService.verifyOtp({ phone, otp, name: name.trim() });
      login(response.data.token, response.data.customer, storefront
        ? { id: storefront.tenantId, name: storefront.name }
        : undefined);
      toast.success(t("phone_verified"));
    } catch {
      // The API interceptor presents the server's actionable error message.
    } finally { setLoading(false); }
  });

  const placeOrder = async () => {
    if (!isAuthenticated) { toast.error(t("verify_phone_before_order")); return; }
    if (fulfillment === "DELIVERY" && addressLine1.trim().length < 3) {
      toast.error(t("delivery_address_required")); return;
    }
    setLoading(true);
    try {
      const response = await apiService.checkout({
        items: items.map((item) => ({ variant_id: item.variant_id, quantity: item.quantity })),
        fulfillment_type: fulfillment,
        customer_note: note.trim() || undefined,
        address: fulfillment === "DELIVERY" ? {
          label: t("home_address"), address_line1: addressLine1.trim(),
          address_line2: addressLine2.trim() || undefined,
          landmark: landmark.trim() || undefined, city: city.trim() || undefined,
          postal_code: postalCode.trim() || undefined, save: saveAddress,
        } : undefined,
      });
      await clearCart(true);
      toast.success(response.message || t("order_placed_successfully"));
      history.replace(storefrontPath(`/order/${response.data.id}`));
    } finally { setLoading(false); }
  };

  if (items.length === 0) { history.replace(storefrontPath("/cart")); return null; }

  return <IonPage>
    <IonHeader><IonToolbar><IonButtons slot="start"><IonBackButton defaultHref={storefrontPath("/cart")} /></IonButtons><IonTitle>{t("checkout")}</IonTitle></IonToolbar></IonHeader>
    <IonContent className="ion-padding">
      <IonCard><IonCardHeader><IonCardTitle>{t("contact_and_verification")}</IonCardTitle></IonCardHeader><IonCardContent>
        <IonList>
          <IonItem><IonInput label={t("name")} labelPlacement="stacked" value={name} disabled={isAuthenticated} onIonInput={(e) => setName(String(e.detail.value ?? ""))} /></IonItem>
          <IonItem><IonInput label={t("phone")} labelPlacement="stacked" inputMode="tel" maxlength={10} value={phone} disabled={isAuthenticated} onIonInput={(e) => setPhone(String(e.detail.value ?? ""))} /></IonItem>
          {!isAuthenticated && otpRequested && <IonItem><IonInput label={t("verification_code")} labelPlacement="stacked" inputMode="numeric" autocomplete="one-time-code" maxlength={6} value={otp} onIonInput={(e) => setOtp(String(e.detail.value ?? ""))} /></IonItem>}
        </IonList>
        {!isAuthenticated && <IonButton type="button" expand="block" fill={otpRequested ? "solid" : "outline"} disabled={loading} onClick={otpRequested ? verifyOtp : requestOtp}>{otpRequested ? t("verify_phone") : t("send_verification_code")}</IonButton>}
        {isAuthenticated && <IonNote color="success">{t("phone_verified")}</IonNote>}
      </IonCardContent></IonCard>

      <IonCard><IonCardHeader><IonCardTitle>{t("how_receive_order")}</IonCardTitle></IonCardHeader><IonCardContent>
        <IonSegment value={fulfillment} onIonChange={(e) => setFulfillment(e.detail.value as "PICKUP" | "DELIVERY")}>
          <IonSegmentButton value="PICKUP"><IonLabel>{t("pickup")}</IonLabel></IonSegmentButton>
          <IonSegmentButton value="DELIVERY"><IonLabel>{t("home_delivery")}</IonLabel></IonSegmentButton>
        </IonSegment>
        {fulfillment === "DELIVERY" && <IonList>
          <IonItem><IonTextarea label={t("address")} labelPlacement="stacked" autoGrow value={addressLine1} onIonInput={(e) => setAddressLine1(String(e.detail.value ?? ""))} /></IonItem>
          <IonItem><IonInput label={t("address_line_2")} labelPlacement="stacked" value={addressLine2} onIonInput={(e) => setAddressLine2(String(e.detail.value ?? ""))} /></IonItem>
          <IonItem><IonInput label={t("landmark")} labelPlacement="stacked" value={landmark} onIonInput={(e) => setLandmark(String(e.detail.value ?? ""))} /></IonItem>
          <IonItem><IonInput label={t("city")} labelPlacement="stacked" value={city} onIonInput={(e) => setCity(String(e.detail.value ?? ""))} /></IonItem>
          <IonItem><IonInput label={t("postal_code")} labelPlacement="stacked" inputMode="numeric" maxlength={6} value={postalCode} onIonInput={(e) => setPostalCode(String(e.detail.value ?? ""))} /></IonItem>
          <IonItem><IonCheckbox checked={saveAddress} onIonChange={(e) => setSaveAddress(e.detail.checked)}>{t("save_address")}</IonCheckbox></IonItem>
        </IonList>}
        <IonItem><IonTextarea label={t("order_note_optional")} labelPlacement="stacked" autoGrow value={note} onIonInput={(e) => setNote(String(e.detail.value ?? ""))} /></IonItem>
      </IonCardContent></IonCard>

      <IonCard><IonCardHeader><IonCardTitle>{t("order_summary")}</IonCardTitle></IonCardHeader><IonCardContent>
        {items.map((item) => <p key={item.variant_id}>{item.quantity} × {item.product_name}<strong style={{ float: "right" }}>{formatCurrency(item.price * item.quantity)}</strong></p>)}
        <hr /><p><strong>{t("total")}</strong><strong style={{ float: "right" }}>{formatCurrency(total)}</strong></p>
        <IonNote>{t("shop_confirms_order_note")}</IonNote>
      </IonCardContent></IonCard>
      <IonButton expand="block" size="large" disabled={loading || !isAuthenticated} onClick={placeOrder}>{t("send_order_request")} · {formatCurrency(total)}</IonButton>
      <IonLoading isOpen={loading} message={t("please_wait")} />
    </IonContent>
  </IonPage>;
};

export default CheckoutPage;
