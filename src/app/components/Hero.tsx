// components/Hero.tsx

export default function Hero() {
    return (
        <section
            className="
        relative
        w-full
        min-h-[600px]
        bg-no-repeat
        bg-right
        bg-cover
      "
            style={{
                backgroundImage: "url('/Ingram-Banner-2-1.png')",
            }}
        >
            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="max-w-2xl">
                    <h1 className="font-[var(--font-inter)] text-[44px] leading-[44px] font-semibold uppercase text-[#5C5C5C]">
                        Ingram Micro and <br /> Microsoft Surface
                    </h1>

                    <p className="text-gray-600 text-lg mb-8">
                        Your Ingram Micro and Microsoft Surface team has created an exclusive<br />
                        demo program that gives resellers the ability to customize, compare
                        and<br /> evaluate the most cutting-edge Surface devices in a few simple steps.
                    </p>

                    <div className="flex items-center gap-6 mb-8">
                        <img
                            src="/Logos-ingram.png"
                            alt="Microsoft Surface"
                            className="h-10 w-auto"
                        />
                    </div>

                    <a
                        href="#create-demo"
                        className="
              inline-flex
    items-center
    justify-center
    font-roboto
    font-medium
    text-[15px]
    leading-[15px]
    text-black
    bg-[#fece00]
    px-10
    py-5
    rounded-md
    hover:bg-yellow-500
    transition
            "
                    >
                        Create Demo Kit
                    </a>
                </div>
            </div>
        </section>
    );
}
