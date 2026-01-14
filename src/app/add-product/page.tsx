// src/app/add-product/page.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

/* ===== FIX: Selected State Type ===== */
type SelectedState = {
    brand: string;
    processor: string;
    generation: string;
    memory: string;
    storage: string;
    fiveg: string;
    copilot: string;
    status: string;
    OS: string;
    formFactor: string;
    screen: string;
};

export default function AddProductPage() {
    const router = useRouter();

    // Custom input toggles
    const [customBrand, setCustomBrand] = useState(false);
    const [customProcessor, setCustomProcessor] = useState(false);
    const [customFormFactor, setCustomFormFactor] = useState(false);
    const [customScreen, setCustomScreen] = useState(false);
    const [customMemory, setCustomMemory] = useState(false);
    const [customGeneration, setCustomGeneration] = useState(false);
    const [customStorage, setCustomStorage] = useState(false);
    const [CustomOS, setCustomOS] = useState(false);

    // State to handle selection per field (like checkbox behavior)
    const [selected, setSelected] = useState<SelectedState>({
        brand: "",
        processor: "",
        generation: "",
        memory: "",
        storage: "",
        fiveg: "",
        copilot: "",
        status: "",
        OS: "",
        formFactor: "",
        screen: "",
    });

    // Refs for file inputs
    const thumbnailRef = useRef<HTMLInputElement>(null);
    const galleryRef = useRef<HTMLInputElement>(null);

    // State for uploaded images
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [gallery, setGallery] = useState<File[]>([]);

    // ===== FIX: field is now keyof SelectedState =====
    const handleSelect = (field: keyof SelectedState, value: string) => {
        setSelected((prev) => ({
            ...prev,
            [field]: prev[field] === value ? "" : value, // toggle
        }));
    };

    // File upload handlers
    const handleThumbnailClick = () => {
        thumbnailRef.current?.click();
    };

    const handleGalleryClick = () => {
        galleryRef.current?.click();
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setThumbnail(e.target.files[0]);
        }
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setGallery(Array.from(e.target.files));
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
            {/* Header Row */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Add New Device</h1>
                <p
                    className="text-sm text-blue-600 cursor-pointer"
                    onClick={() => router.push("/create-demo-kit")}
                >
                    ← Back to Inventory
                </p>
            </div>

            {/* Product Images */}
<div className="bg-white rounded-xl shadow p-6 mb-6">
    <h2 className="font-medium mb-4 flex items-center gap-2">
        Product Images
    </h2>
    <p className="text-xs text-gray-400 mb-4">Supported: PNG, JPG, WEBP</p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Primary Thumbnail */}
        <div
            onClick={!thumbnail ? handleThumbnailClick : undefined}
            className="relative bg-gray-300 border border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-gray-600 transition"
        >
            {thumbnail ? (
                <>
                    {/* Remove Thumbnail */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setThumbnail(null);
                            if (thumbnailRef.current) {
                                thumbnailRef.current.value = "";
                            }
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs"
                    >
                        ✕
                    </button>

                    <img
                        src={URL.createObjectURL(thumbnail)}
                        alt="Thumbnail"
                        className="w-20 h-20 object-cover mb-2"
                    />
                </>
            ) : (
                <div className="bg-gray-300 w-12 h-12 flex items-center justify-center rounded mb-2">
                    <img src="/upload-icon.png" alt="Upload" className="w-10 h-10" />
                </div>
            )}

            <p className="text-sm font-medium text-gray-600">Thumbnail Image</p>
            <p className="text-xs text-gray-400">Click to upload (Max 10MB)</p>

            <input
                type="file"
                accept="image/*"
                ref={thumbnailRef}
                className="hidden"
                onChange={handleThumbnailChange}
            />
        </div>

        {/* Gallery Images */}
        <div
            onClick={handleGalleryClick}
            className="bg-gray-300 border border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-gray-600 transition"
        >
            <div className="bg-gray-300 w-12 h-12 flex items-center justify-center rounded mb-2">
                <img
                    src="/upload-gallery.png"
                    alt="Upload Gallery"
                    className="w-6 h-6 object-contain"
                />
            </div>

            <p className="text-sm font-medium text-gray-600">Additional Images</p>
            <p className="text-xs text-gray-400">Add more images (Max 5)</p>

            {gallery.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                    {gallery.map((file, idx) => (
                        <div key={idx} className="relative">
                            {/* Remove Gallery Image */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setGallery((prev) =>
                                        prev.filter((_, i) => i !== idx)
                                    );
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs"
                            >
                                ✕
                            </button>

                            <img
                                src={URL.createObjectURL(file)}
                                alt={`Gallery ${idx}`}
                                className="w-12 h-12 object-cover rounded"
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Gallery Input */}
            <input
                type="file"
                multiple
                accept="image/*"
                ref={galleryRef}
                className="hidden"
                onChange={(e) => {
                    const files = e.target.files ? Array.from(e.target.files) : [];
                    // Max 5 images
                    setGallery((prev) => {
                        const combined = [...prev, ...files];
                        if (combined.length > 5) {
                            alert("Maximum 5 images allowed");
                            return combined.slice(0, 5);
                        }
                        return combined;
                    });
                }}
            />
        </div>
    </div>
</div>


            {/* Form */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Product Name */}
                    <div>
                        <p className="text-sm font-medium mb-2">Product Name</p>
                        <input className="w-full border rounded px-3 py-2 text-sm" />
                    </div>

                    {/* SKU */}
                    <div>
                        <p className="text-sm font-medium mb-2">SKU</p>
                        <input className="w-full border rounded px-3 py-2 text-sm" />
                    </div>

                    {/* OEM Brand */}
                    <div>
                        <p className="text-sm font-medium mb-2">OEM Brand</p>
                        <div className="flex gap-4 text-sm">
                            {["Microsoft-Surface", "Custom"].map((b) => (
                                <label key={b} className="flex items-center gap-2 cursor-pointer relative">
                                    <div
                                        onClick={() => {
                                            handleSelect("brand", b);
                                            setCustomBrand(b === "Custom" && selected.brand !== "Custom");
                                        }}
                                        className={`w-5 h-5 border border-gray-400 rounded-sm flex items-center justify-center ${selected.brand === b ? "bg-blue-600" : "bg-white"
                                            }`}
                                    >
                                        {selected.brand === b && <span className="text-white text-sm">✓</span>}
                                    </div>
                                    <span className="select-none">{b}</span>
                                </label>
                            ))}
                        </div>
                        {customBrand && <input className="mt-2 w-full border rounded px-3 py-2 text-sm" />}
                    </div>

                    {/* Processor */}
                    <div>
                        <p className="text-sm font-medium mb-2">Processor</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {[
                                "Intel® Core™ Ultra 5",
                                "Intel® Core™ Ultra 7",
                                "Snapdragon X Elite",
                                "Snapdragon X Plus",
                                "Custom",
                            ].map((option) => (
                                <label key={option} className="flex items-center gap-2 cursor-pointer relative">
                                    <div
                                        onClick={() => {
                                            handleSelect("processor", option);
                                            setCustomProcessor(option === "Custom" && selected.processor !== "Custom");
                                        }}
                                        className={`w-5 h-5 border border-gray-400 rounded-sm flex items-center justify-center ${selected.processor === option ? "bg-blue-600" : "bg-white"
                                            }`}
                                    >
                                        {selected.processor === option && <span className="text-white text-sm">✓</span>}
                                    </div>
                                    <span className="select-none">{option}</span>
                                </label>
                            ))}
                        </div>
                        {customProcessor && <input className="mt-2 w-full border rounded px-3 py-2 text-sm" />}
                    </div>

                    {/* Form Factor (Updated style like Processor) */}
                    <div>
                        <p className="text-sm font-medium mb-2">Form Factor</p>
                        <div className="flex gap-4 text-sm">
                            {["Notebook", "2in1's", "Accessories"].map((option) => (
                                <label key={option} className="flex items-center gap-2 cursor-pointer relative">
                                    <div
                                        onClick={() => {
                                            handleSelect("formFactor", option);
                                            setCustomFormFactor(false);
                                        }}
                                        className={`w-5 h-5 border border-gray-400 rounded-sm flex items-center justify-center ${selected.formFactor === option ? "bg-blue-600" : "bg-white"
                                            }`}
                                    >
                                        {selected.formFactor === option && <span className="text-white text-sm">✓</span>}
                                    </div>
                                    <span className="select-none">{option}</span>
                                </label>
                            ))}
                            <label className="flex items-center gap-2 cursor-pointer relative">
                                <div
                                    onClick={() => {
                                        handleSelect("formFactor", "Custom");
                                        setCustomFormFactor(true);
                                    }}
                                    className={`w-5 h-5 border border-gray-400 rounded-sm flex items-center justify-center ${selected.formFactor === "Custom" ? "bg-blue-600" : "bg-white"
                                        }`}
                                >
                                    {selected.formFactor === "Custom" && <span className="text-white text-sm">✓</span>}
                                </div>
                                <span className="select-none">Custom</span>
                            </label>
                        </div>
                        {customFormFactor && (
                            <input
                                className="mt-2 w-full border rounded px-3 py-2 text-sm"
                                placeholder="Enter custom form factor"
                            />
                        )}
                    </div>

                    {/* Generation */}
                    <div>
                        <p className="text-sm font-medium mb-2">Generation</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {["Intel Core Ultra Series 1", "Intel Core Ultra Series 2", "Custom"].map((option) => (
                                <label key={option} className="flex items-center gap-2 cursor-pointer relative">
                                    <div
                                        onClick={() => {
                                            handleSelect("generation", option);
                                            setCustomGeneration(option === "Custom" && selected.generation !== "Custom");
                                        }}
                                        className={`w-5 h-5 border border-gray-400 rounded-sm flex items-center justify-center ${selected.generation === option ? "bg-blue-600" : "bg-white"
                                            }`}
                                    >
                                        {selected.generation === option && <span className="text-white text-sm">✓</span>}
                                    </div>
                                    <span className="select-none">{option}</span>
                                </label>
                            ))}
                        </div>
                        {customGeneration && <input className="mt-2 w-full border rounded px-3 py-2 text-sm" />}
                    </div>

                    {/* Memory */}
                    <div>
                        <p className="text-sm font-medium mb-2">Memory</p>
                        <div className="flex gap-4 text-sm">
                            {["16 GB", "32 GB", "64 GB", "Custom"].map((option) => (
                                <label key={option} className="flex items-center gap-2 cursor-pointer relative">
                                    <div
                                        onClick={() => {
                                            handleSelect("memory", option);
                                            setCustomMemory(option === "Custom" && selected.memory !== "Custom");
                                        }}
                                        className={`w-5 h-5 border border-gray-400 rounded-sm flex items-center justify-center ${selected.memory === option ? "bg-blue-600" : "bg-white"
                                            }`}
                                    >
                                        {selected.memory === option && <span className="text-white text-sm">✓</span>}
                                    </div>
                                    <span className="select-none">{option}</span>
                                </label>
                            ))}
                        </div>
                        {customMemory && <input className="mt-2 w-full border rounded px-3 py-2 text-sm" />}
                    </div>

                    {/* Storage */}
                    <div>
                        <p className="text-sm font-medium mb-2">Storage</p>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                            {["128GB", "256GB", "512GB", "1TB", "Custom"].map((option) => (
                                <label key={option} className="flex items-center gap-2 cursor-pointer relative">
                                    <div
                                        onClick={() => {
                                            handleSelect("storage", option);
                                            setCustomStorage(option === "Custom" && selected.storage !== "Custom");
                                        }}
                                        className={`w-5 h-5 border border-gray-400 rounded-sm flex items-center justify-center ${selected.storage === option ? "bg-blue-600" : "bg-white"
                                            }`}
                                    >
                                        {selected.storage === option && <span className="text-white text-sm">✓</span>}
                                    </div>
                                    <span className="select-none">{option}</span>
                                </label>
                            ))}
                        </div>
                        {customStorage && <input className="mt-2 w-full border rounded px-3 py-2 text-sm" />}
                    </div>

                    {/* Operating System */}
                    <div>
                        <p className="text-sm font-medium mb-2">Operating System</p>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                            {["Windows 11", "Custom"].map((option) => (
                                <label key={option} className="flex items-center gap-2 cursor-pointer relative">
                                    <div
                                        onClick={() => {
                                            handleSelect("OS", option);
                                            setCustomOS(option === "Custom" && selected.OS !== "Custom");
                                        }}
                                        className={`w-5 h-5 border border-gray-400 rounded-sm flex items-center justify-center ${selected.storage === option ? "bg-blue-600" : "bg-white"
                                            }`}
                                    >
                                        {selected.OS === option && <span className="text-white text-sm">✓</span>}
                                    </div>
                                    <span className="select-none">{option}</span>
                                </label>
                            ))}
                        </div>
                        {CustomOS && <input className="mt-2 w-full border rounded px-3 py-2 text-sm" />}
                    </div>

                    {/* Technologies */}
                    <div>
                        <p className="text-sm font-medium mb-2">Technologies</p>
                        <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Technologies" />
                    </div>


                    {/* Total Inventory */}
                    <div>
                        <p className="text-sm font-medium mb-2">Total Inventory</p>
                        <input type="number" className="w-full border rounded px-3 py-2 text-sm" />
                    </div>

                    {/* Inventory Type */}
                    <div>
                        <p className="text-sm font-medium mb-2">Inventory Type</p>
                        <select className="w-full border rounded px-3 py-2 text-sm">
                            <option value="">Select type</option>
                            <option>Program</option>
                            <option>Global</option>
                        </select>
                    </div>

                    {/* Stock Quantity */}
                    <div>
                        <p className="text-sm font-medium mb-2">Stock Quantity</p>
                        <input type="number" className="w-full border rounded px-3 py-2 text-sm" />
                    </div>

                    {/* Screen Size */}
                    <div>
                        <p className="text-sm font-medium mb-2">Screen Size</p>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                            {['13"', '13.8', '14"', '15"', "Custom"].map((option) => (
                                <label key={option} className="flex items-center gap-2 cursor-pointer relative">
                                    <div
                                        onClick={() => {
                                            handleSelect("screen", option);
                                            setCustomScreen(option === "Custom" && selected.screen !== "Custom");
                                        }}
                                        className={`w-5 h-5 border border-gray-400 rounded-sm flex items-center justify-center ${selected.screen === option ? "bg-blue-600" : "bg-white"
                                            }`}
                                    >
                                        {selected.screen === option && <span className="text-white text-sm">✓</span>}
                                    </div>
                                    <span className="select-none">{option}</span>
                                </label>
                            ))}
                        </div>
                        {customScreen && <input className="mt-2 w-full border rounded px-3 py-2 text-sm" />}
                    </div>

                    {/* 5G Enabled */}
                    <div>
                        <p className="text-sm font-medium mb-2">5G Enabled</p>
                        <div className="flex gap-4 text-sm">
                            {["Yes", "No"].map((option) => (
                                <label key={option} className="flex items-center gap-2 cursor-pointer relative">
                                    <div
                                        onClick={() => handleSelect("fiveg", option)}
                                        className={`w-5 h-5 border border-gray-400 rounded-sm flex items-center justify-center ${selected.fiveg === option ? "bg-blue-600" : "bg-white"
                                            }`}
                                    >
                                        {selected.fiveg === option && <span className="text-white text-sm">✓</span>}
                                    </div>
                                    <span className="select-none">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Copilot */}
                    <div>
                        <p className="text-sm font-medium mb-2">Copilot</p>
                        <div className="flex gap-4 text-sm">
                            {["Yes", "No"].map((option) => (
                                <label key={option} className="flex items-center gap-2 cursor-pointer relative">
                                    <div
                                        onClick={() => handleSelect("copilot", option)}
                                        className={`w-5 h-5 border border-gray-400 rounded-sm flex items-center justify-center ${selected.copilot === option ? "bg-blue-600" : "bg-white"
                                            }`}
                                    >
                                        {selected.copilot === option && <span className="text-white text-sm">✓</span>}
                                    </div>
                                    <span className="select-none">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Product Status */}
                    <div>
                        <p className="text-sm font-medium mb-2">Product Status</p>
                        <div className="flex gap-4 text-sm">
                            {["Publish", "Private"].map((option) => (
                                <label key={option} className="flex items-center gap-2 cursor-pointer relative">
                                    <div
                                        onClick={() => handleSelect("status", option)}
                                        className={`w-5 h-5 border border-gray-400 rounded-sm flex items-center justify-center ${selected.status === option ? "bg-blue-600" : "bg-white"
                                            }`}
                                    >
                                        {selected.status === option && <span className="text-white text-sm">✓</span>}
                                    </div>
                                    <span className="select-none">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Publish Date */}
                    <div>
                        <p className="text-sm font-medium mb-2">Publish Date</p>
                        <input type="date" className="w-full border rounded px-3 py-2 text-sm" />
                    </div>
                </div>

                <textarea className="w-full border rounded px-3 py-2 text-sm mt-6 h-28" />

                <div className="flex justify-center">
                    <button className="mt-6 bg-blue-600 text-white px-8 py-2 rounded">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
