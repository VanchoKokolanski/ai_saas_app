"use client";
import React from "react";
import Image from "next/image";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import { dataUrl, debounce, download, getImageSize } from "@/lib/utils";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";

const TransformedImage = ({
  image,
  type,
  isTransforming,
  setIsTransforming,
  transformationConfig,
  hasDownload = false,
}: TransformedImageProps) => {
  const downloadHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    download(
      getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image?.publicId,
        ...transformationConfig,
      }),
      image?.title
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex-between">
        <h3 className="h3-bold text-dark-600">Transformed</h3>
        {hasDownload && (
          <button className="download-btn" onClick={(e) => downloadHandler}>
            <Image
              src="/assets/icons/download.svg"
              alt="download"
              width={24}
              height={24}
              className="pb-[6px]"
            />
          </button>
        )}
      </div>
      {image?.publicId && transformationConfig ? (
        <div className="relative">
          <CldImage
            src={image?.publicId}
            alt={image?.title}
            width={getImageSize(type, image, "width")}
            height={getImageSize(type, image, "height")}
            sizes={"(max-width: 767px) 100vw 50vw"}
            placeholder={dataUrl as PlaceholderValue}
            className="transformed-image"
            onLoad={() => {
              setIsTransforming && setIsTransforming(false);
            }}
            onError={() => {
              debounce(() => {
                setIsTransforming && setIsTransforming(false);
              }, 8000)()
            }}
            {...transformationConfig}
          />
          {isTransforming && (
            <div className="transforming-loader">
              <Image
                src={"/assets/icons/spinner.svg"}
                alt="spiner"
                width={50}
                height={50}
              />
              <p className="text-white/80 ">Please wait...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="transformed-placeholder">transformed image</div>
      )}
    </div>
  );
};

export default TransformedImage;
