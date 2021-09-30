import React, { useLayoutEffect, useState, useRef, useEffect } from "react";
import { photoStream } from "./photo.service";
import "./Viewer.scss";

export function Viewer() {
  const [image1, setImage1] = useState<string>("");
  const [image2, setImage2] = useState<string>("");
  const [isOdd, setIsOdd] = useState(true);

  useEffect(() => {
    const subscription = photoStream.subscribe((newImage) => {
      if (!isOdd) {
        setImage1(newImage);
      } else {
        setImage2(newImage);
      }
      setIsOdd(!isOdd);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isOdd, image1, image2]);

  return (
    <div className="viewer">
      <span
        style={{
          position: "fixed",
          top: 0,
          right: "10px",
          fontSize: "20px",
          color: "white",
          background: "darkorange",
          zIndex: 1,
        }}
      >
        {isOdd ? image1 : image2}
      </span>

      <Image imageLocation={image1} isHidden={!isOdd} className="transform-origin-top-right"/>
      <Image imageLocation={image2} isHidden={isOdd} className="transform-origin-bottom-left"/>
    </div>
  );
}

function Image({
  imageLocation,
  isHidden = false,
  className = ''
}: {
  imageLocation: string;
  isHidden?: boolean;
  className?: string;
}) {
  const imageHolderRef = useRef<HTMLDivElement>(null);
  const blurryImageHolderRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!imageHolderRef.current || !blurryImageHolderRef.current) return;

    imageHolderRef.current.setAttribute(
      "style",
      `background-image: url(/photos/${encodeURIComponent(imageLocation)})`
    );

    blurryImageHolderRef.current.setAttribute(
      "style",
      `background-image: url(/photos/${encodeURIComponent(imageLocation)})`
    );
  }, [imageLocation]);

  return (
    <>
      <div
        className={`fade-transition blurry-filter cover ${
          (isHidden && "hide-and-scale") || ""
        } ${className || ''}`}
        ref={blurryImageHolderRef}
      ></div>
      <div
        className={`fade-transition ${(isHidden && "hide-and-scale") || ""} ${className || ''}`}
        ref={imageHolderRef}
      ></div>
    </>
  );
}
