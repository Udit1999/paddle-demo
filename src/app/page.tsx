"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { useEffect, useState } from "react";

type ProductCardProps = {
  productId: string;
  priceId: string;
  name: string;
  price: number;
  currency: string;
  image_url: string;
  description: string;
  onBuyNow: (priceId: string) => void;
};

const ProductCard = ({
  productId,
  priceId,
  name,
  price,
  currency,
  image_url,
  onBuyNow,
  description,
}: ProductCardProps) => {
  return (
    <div id={productId} className={styles.card}>
      <Image alt={name} src={image_url} fill={true} />
      <h2 className={styles.content}>{name}</h2>
      <p className={styles.content}>{description}</p>
      <p className={styles.content}>
        {currency} {price}
      </p>
      <button onClick={() => onBuyNow(priceId)} className={styles.btn}>
        Buy Now
      </button>
    </div>
  );
};
export default function Home() {
  const [paddle, setPaddle] = useState<Paddle>();
  const [products, setProducts] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    initializePaddle({
      environment: "sandbox",
      token: "test_faf198e6d24bc288d7a798cefbc",
    }).then((paddleInstance: Paddle | undefined) => {
      if (paddleInstance) {
        setPaddle(paddleInstance);
      }
    });

    fetch("/api/products")
      .then((res) => res.json())
      .then(({ products }) => {
        setProducts(products);
      })
      .catch((e) => console.error(e));
  }, []);

  const openCheckout = (priceId: string) => {
    const itemsList = [
      {
        priceId,
        quantity: 1,
      },
    ];
    paddle?.Checkout.open({
      items: itemsList,
      settings: {
        displayMode: "overlay",
        theme: "light",
        locale: "en",
      },
    });
  };

  return (
    <main className={styles.main}>
      <section className={styles.products}>
        {products?.map((product) => {
          const { id, description, name, image_url, prices } = product as any;
          const priceId = prices[0].id;
          const { amount, currency_code } = prices[0].unit_price;

          return (
            <ProductCard
              currency={currency_code}
              image_url={image_url}
              name={name}
              onBuyNow={openCheckout}
              price={+amount / 100}
              priceId={priceId}
              productId={id}
              description={description}
            />
          );
        })}
      </section>
    </main>
  );
}
