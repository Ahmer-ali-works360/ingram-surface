"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileSignature,
  faBoxOpen,
  faCreditCard,
  faTruckFast,
  faArrowRotateLeft,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";

const steps = [
  {
    title: "Registration",
    desc: "Complete the registration process to start using the portal.",
    icon: faFileSignature,
    topColor: "#3FA0D9",
    leftColor: "#1E73BE",
  },
  {
    title: "Create Demo Kit",
    desc: "Create demo kit with selected products.",
    icon: faBoxOpen,
    topColor: "#F59E0B",
    leftColor: "#D97706",
  },
  {
    title: "Checkout",
    desc: "Proceed checkout and confirm order.",
    icon: faCreditCard,
    topColor: "#10B981",
    leftColor: "#059669",
  },
  {
    title: "Order Shipment",
    desc: "Demo kit will be shipped to you.",
    icon: faTruckFast,
    topColor: "#8B5CF6",
    leftColor: "#7C3AED",
  },
  {
    title: "Return Order",
    desc: "Return demo kit after completion.",
    icon: faArrowRotateLeft,
    topColor: "#EF4444",
    leftColor: "#DC2626",
  },
  {
    title: "Report a Win",
    desc: "Report your successful project.",
    icon: faTrophy,
    topColor: "#0EA5E9",
    leftColor: "#0284C7",
  },
];

export default function HowItWorksPage() {
  const router = useRouter();

  /**
   * 🔒 AUTH CHECK (only for this page)
   */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/login?redirect=/how-it-works");
      }
    });
  }, [router]);

  return (
    <section className="py-[88px]">
      <div className="max-w-[1200px] mx-auto px-20">
        {/* Heading */}
        <h2 className="text-[28px] font-semibold text-center mb-14 text-gray-900">
          How it Works
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              {/* BACK DECORATIVE BOX */}
              <div
                className="
                  absolute
                  -top-[20px]
                  -left-[20px]
                  right-[150px]
                  bottom-[150px]
                  rounded-[12px]
                  border-t-[2px]
                  border-l-[2px]
                  transition-all
                  duration-300
                  ease-linear
                  group-hover:border-t-[4px]
                  group-hover:border-l-[4px]
                  z-0
                "
                style={{
                  borderTopColor: step.topColor,
                  borderLeftColor: step.leftColor,
                }}
              />

              {/* FRONT MAIN CARD */}
              <div
                className="
                  relative
                  z-10
                  bg-white
                  rounded-[22px]
                  px-10
                  pt-16
                  pb-14
                  text-center
                  shadow-[0_10px_30px_rgba(0,0,0,0.12)]
                "
              >
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div
                    className="
                      w-[72px]
                      h-[72px]
                      rounded-full
                      bg-[#F3F3F3]
                      border-[4px]
                      border-[#EFEFEF]
                      shadow-[0_4px_8px_rgba(0,0,0,0.12)]
                      flex
                      items-center
                      justify-center
                      transition-colors
                      duration-200
                      group-hover:border-[#D1D1D1]
                    "
                  >
                    <FontAwesomeIcon
                      icon={step.icon}
                      className="text-[#1E73BE] text-[30px]"
                    />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-[16px] font-semibold uppercase tracking-wide text-gray-800 mb-4">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-[14px] leading-[1.8] text-gray-600 px-2">
                  {step.desc}
                </p>

                {/* Number badge */}
                <span
                  className="
                    absolute
                    -bottom-4
                    -right-4
                    w-[60px]
                    h-[42px]
                    bg-[#3FA0D9]
                    text-white
                    text-[18px]
                    font-semibold
                    flex
                    items-center
                    justify-center
                  "
                  style={{ borderTopLeftRadius: "14px" }}
                >
                  {i + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
