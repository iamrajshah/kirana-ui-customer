import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonInput,
  IonButton,
  IonButtons,
  IonBackButton,
  IonLoading,
  IonToast,
} from "@ionic/react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useAuthStore } from "@store/auth.store";
import { apiService } from "@services/api";
import { toast } from "@services/toast";

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { login } = useAuthStore();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    // Validation
    if (!name.trim()) {
      setError(t("name_required"));
      return;
    }

    if (phone.length !== 10) {
      setError(t("valid_mobile"));
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t("valid_email"));
      return;
    }

    if (password.length < 6) {
      setError(t("password_min"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("passwords_mismatch"));
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.register({
        name: name.trim(),
        phone,
        email: email.trim() || undefined,
        password,
      });

      if (response.success) {
        // Auto-login after successful registration
        login(response.data.token, response.data.customer);
        toast.success(t("register_success"));
        history.replace("/home");
      } else {
        setError(response.message || t("registration_failed"));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t("registration_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" />
          </IonButtons>
          <IonTitle>{t("create_account")}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100%",
          }}
        >
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                margin: "0 0 8px 0",
              }}
            >
              {t("create_account")}
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "var(--ion-color-medium, #666)",
              }}
            >
              {t("register_subtitle")}
            </p>
          </div>

          <IonCard style={{ width: "100%", maxWidth: "400px" }}>
            <IonCardContent>
              <IonInput
                type="text"
                placeholder={t("name")}
                value={name}
                onIonChange={(e) => setName(e.detail.value || "")}
                style={{ fontSize: "16px", marginBottom: "16px" }}
              />
              <IonInput
                type="tel"
                placeholder={t("mobile_number")}
                value={phone}
                onIonChange={(e) => setPhone(e.detail.value || "")}
                maxlength={10}
                style={{ fontSize: "16px", marginBottom: "16px" }}
              />
              <IonInput
                type="email"
                placeholder={`${t("email")} (${t("optional")})`}
                value={email}
                onIonChange={(e) => setEmail(e.detail.value || "")}
                style={{ fontSize: "16px", marginBottom: "16px" }}
              />
              <IonInput
                type="password"
                placeholder={t("password")}
                value={password}
                onIonChange={(e) => setPassword(e.detail.value || "")}
                style={{ fontSize: "16px", marginBottom: "16px" }}
              />
              <IonInput
                type="password"
                placeholder={t("confirm_password")}
                value={confirmPassword}
                onIonChange={(e) => setConfirmPassword(e.detail.value || "")}
                style={{ fontSize: "16px", marginBottom: "20px" }}
              />
              <IonButton
                expand="block"
                onClick={handleRegister}
                disabled={loading}
                style={{ fontSize: "16px", height: "48px" }}
              >
                {t("register")}
              </IonButton>
              <IonButton
                expand="block"
                fill="clear"
                onClick={() => history.push("/login")}
                style={{ marginTop: "8px" }}
              >
                {t("already_have_account")}
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>

        <IonLoading isOpen={loading} message={t("loading")} />
        <IonToast
          isOpen={!!error}
          message={error}
          duration={3000}
          onDidDismiss={() => setError("")}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
