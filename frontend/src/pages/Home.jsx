import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const sliderProducts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const featuredProducts = [1, 2, 3, 4, 5, 6];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1, //  mobile par ek hi slide
          centerMode: true, // insta-style center
          centerPadding: "0px", // pura width le
        },
      },
    ],
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="h-[80vh] flex flex-col justify-center items-center text-center bg-gradient-to-r from-yellow-100 via-orange-100 to-orange-200 px-6">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-[var(--artisan-dark)] drop-shadow-md">
          Empowering Local Artisans with AI
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-700 max-w-2xl">
          AI-Artisan helps small artisans showcase their products with
          AI-generated descriptions, making it easier to reach global customers.
        </p>
        <div className="mt-8 flex gap-4">
          <a
            href="/products"
            className="px-6 py-3 bg-[var(--artisan-dark)] text-white rounded-lg hover:bg-[var(--artisan-brown)] shadow-lg transition"
          >
            Explore Products
          </a>
          <a
            href="/register"
            className="px-6 py-3 border-2 border-[var(--artisan-dark)] text-[var(--artisan-dark)] rounded-lg hover:bg-[var(--artisan-dark)] hover:text-white shadow-lg transition"
          >
            Register Now
          </a>
        </div>
      </section>

      {/* Product Slider Section */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-bold text-[var(--artisan-dark)] mb-8 text-center">
          Top Products
        </h2>
        <Slider {...sliderSettings}>
          {sliderProducts.map((p) => (
            <div key={p} className="px-3">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden">
                <img
                  src={`https://picsum.photos/600/350?random=${p}`}
                  alt={`Product ${p}`}
                  className="w-full h-60 object-cover rounded-t-xl"
                />
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-lg">Product {p}</h3>
                  <p className="text-gray-600 text-sm">
                    Beautiful artisan-made product.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-6 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold text-[var(--artisan-dark)] mb-10">
          Featured Products
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((p) => (
            <div
              key={p}
              className="p-4 bg-white shadow-md hover:shadow-xl rounded-xl transition"
            >
              <img
                src={`https://picsum.photos/400/250?random=${p + 10}`}
                alt="Product"
                className="rounded-lg mb-4 w-full h-60 object-cover"
              />
              <h3 className="font-semibold text-lg">Handmade Craft {p}</h3>
              <p className="text-gray-600">Beautiful artisan-made product.</p>
            </div>
          ))}
        </div>
        <a
          href="/products"
          className="inline-block mt-8 px-6 py-3 bg-[var(--artisan-dark)] text-white rounded-lg hover:bg-[var(--artisan-brown)] shadow-lg transition"
        >
          View All Products
        </a>
      </section>
    </div>
  );
};

export default Home;
