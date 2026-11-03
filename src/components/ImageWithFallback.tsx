import React, { useEffect, useState } from 'react';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  fallbackSrc?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  style,
  fallbackSrc = '/demo-products/grocery.svg',
}) => {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
    setImgSrc(src || fallbackSrc);
  }, [fallbackSrc, src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default ImageWithFallback;
