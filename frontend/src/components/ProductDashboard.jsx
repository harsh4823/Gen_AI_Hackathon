// src/components/ProductDashboard.jsx

import { useState, useEffect, useRef } from "react";
import { FaPlus, FaUpload, FaMicrophone, FaTrash, FaStopCircle, FaSave } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../services/api";
// ✨ 1. Import Redux hooks and the action creator
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from './../store/actions/productAction';

// --- Local API Functions (generate and save) ---
// The generateProductDraft and saveFinalProduct functions remain the same as before.
// We are only replacing the product list fetching.

const generateProductDraft = async (formData) => {
    // (This function's code is unchanged)
    try {
        toast.loading("Our AI is crafting your product details...");
        const response = await api.post("/products", formData, { headers: { "Content-Type": "multipart/form-data" } });
        toast.dismiss();
        toast.success("Draft generated successfully!");
        return response.data;
    } catch (error) {
        toast.dismiss(); console.error("Error generating product draft:", error);
        const errorMessage = error.response?.data?.message || "Could not generate draft.";
        toast.error(errorMessage); throw error;
    }
};

const saveFinalProduct = async (productData, productId) => {
    // (This function's code is unchanged)
    if (!productId) {
        toast.error("Product ID is missing."); throw new Error("Product ID is missing.");
    }
    const productDTO = {
        productName: productData.title, description: productData.description,
        keyFeatures: productData.keyFeatures, material: productData.materials,
        careInstructions: productData.careInstructions, images: productData.images || [productData.imageUrl],
        status: "PUBLISHED"
    };
    try {
        toast.loading("Saving product...");
        const response = await api.put(`/products/${productId}`, productDTO);
        toast.dismiss(); toast.success("Product saved and published!");
        return response.data;
    } catch (error) {
        toast.dismiss(); console.error("Error saving product:", error);
        const errorMessage = error.response?.data?.message || "Could not save product.";
        toast.error(errorMessage); throw error;
    }
};


// --- The Main Component ---

const ProductDashboard = () => {
    // ✨ 2. Get the dispatch function and select state from the Redux store
    const dispatch = useDispatch();
    const { products, loading: isLoading, error } = useSelector(state => state.products);

    // This local state remains for managing the component's view
    const [view, setView] = useState("list");

    // All other local states for the form, recorder, etc., remain the same
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [audioMode, setAudioMode] = useState("record");
    const [draftProduct, setDraftProduct] = useState(null);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [newItemValues, setNewItemValues] = useState({ keyFeatures: "", materials: "" });
    const mediaRecorderRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const audioChunksRef = useRef([]);

    // ✨ 3. Update useEffect to dispatch the Redux action
    useEffect(() => {
        if (view === "list") {
            // Fetch page 0 with 9 items per page. Adjust as needed.
            dispatch(fetchProducts("page=0&size=9"));
        }
    }, [view, dispatch]);

    // Optional: Add a useEffect to show an error toast if the fetch fails
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);


    // ✨ 4. Update handleSaveProduct to re-fetch the list on success
    const handleSaveProduct = async () => {
        const finalDraftProduct = {
            ...draftProduct,
            keyFeatures: [...(draftProduct.keyFeatures || [])],
            materials: [...(draftProduct.materials || [])]
        };
        if (newItemValues.keyFeatures.trim()) finalDraftProduct.keyFeatures.push(newItemValues.keyFeatures.trim());
        if (newItemValues.materials.trim()) finalDraftProduct.materials.push(newItemValues.materials.trim());

        const { title, description, keyFeatures, materials, careInstructions } = finalDraftProduct;

        if (!title?.trim() || !description?.trim() || !careInstructions?.trim() || keyFeatures.every(item => item.trim() === '') || materials.every(item => item.trim() === '')) {
            toast.error("Please ensure all fields are filled out before saving.");
            return;
        }

        try {
            await saveFinalProduct(finalDraftProduct, currentProductId);
            resetAddForm();
            setView("list");
            // After saving, the view changes to "list", which will trigger the
            // useEffect hook above to re-fetch the products automatically.
        } catch (error) {
            console.log("Failed to save product.");
        }
    };


    // All other functions (handleImageChange, handleGenerateDraft, startRecording, etc.)
    // remain the same. The only change needed was in handleSaveProduct.
    // ... (rest of your component functions)

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
    };
    const handleAudioFileChange = (e) => {
        const file = e.target.files[0];
        if (file) { setAudioFile(file); setAudioUrl(URL.createObjectURL(file)); }
    };
    const handleGenerateDraft = async () => {
        if (!imageFile || !audioFile) { toast.error("Please provide both an image and an audio description."); return; }
        const formData = new FormData();
        formData.append("images", imageFile);
        formData.append("audio", audioFile);
        try {
            const draftData = await generateProductDraft(formData);
            if (draftData.productId) {
                setCurrentProductId(draftData.productId);
            } else {
                console.error("CRITICAL: Product ID not found in draft response from backend.", draftData);
                toast.error("An error occurred. Could not retrieve a valid Product ID.");
                return;
            }
            const draftWithPreview = { ...draftData, imageUrl: draftData.images?.[0] || null };
            setDraftProduct(draftWithPreview);
            setView("edit");
        } catch (error) {
            console.log("Draft generation failed.");
        }
    };
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setIsRecording(true);
            audioChunksRef.current = [];
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => audioChunksRef.current.push(event.data);
            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
                const url = URL.createObjectURL(audioBlob);
                setAudioFile(audioBlob); setAudioUrl(url);
                stream.getTracks().forEach(track => track.stop());
            };
            mediaRecorderRef.current.start();
            toast.success("Recording started!");
        } catch (err) { toast.error("Microphone access denied."); }
    };
    const stopRecording = () => {
        if (mediaRecorderRef.current?.state === "recording") {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            toast.success("Recording stopped.");
        }
    };
    const handleDraftChange = (e) => {
        const { name, value } = e.target;
        setDraftProduct(prev => ({ ...prev, [name]: value }));
    };
    const handleListChange = (fieldName, index, value) => {
        const updatedList = [...draftProduct[fieldName]];
        updatedList[index] = value;
        setDraftProduct(prev => ({ ...prev, [fieldName]: updatedList }));
    };
    const handleNewItemChange = (fieldName, value) => {
        setNewItemValues(prev => ({ ...prev, [fieldName]: value }));
    };
    const addListItem = (fieldName) => {
        const valueToAdd = newItemValues[fieldName]?.trim();
        if (valueToAdd) {
            setDraftProduct(prev => ({ ...prev, [fieldName]: [...(prev[fieldName] || []), valueToAdd] }));
            setNewItemValues(prev => ({ ...prev, [fieldName]: "" }));
        }
    };
    const removeListItem = (fieldName, index) => {
        setDraftProduct(prev => ({ ...prev, [fieldName]: (prev[fieldName] || []).filter((_, i) => i !== index) }));
    };
    const resetAddForm = () => {
        setImageFile(null); setImagePreview(null);
        setAudioFile(null); setAudioUrl(null);
        setDraftProduct(null); setCurrentProductId(null);
        setNewItemValues({ keyFeatures: "", materials: "" });
    };

    // --- RENDER FUNCTIONS ---
    // The render functions (renderListView, renderAddView, renderEditView)
    // are now driven by the 'products' and 'isLoading' props from Redux,
    // so no changes are needed inside them.
    const renderListView = () => (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[var(--artisan-dark)]">My Products</h1>
            <button
              onClick={() => { setView("add"); resetAddform(); }}
              className="flex items-center gap-2 bg-[var(--artisan-dark)] text-white py-2 px-4 rounded-lg hover:bg-[var(--artisan-brown)] transition duration-300"
            >
              <FaPlus /> Add New Product
            </button>
          </div>
          {isLoading ? <p>Loading products...</p> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.productId} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img src={product.images[0]} alt={product.productName} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h2 className="font-bold text-lg">{product.productName}</h2>
                    <p className="text-gray-600 text-sm truncate">{product.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
    );
    const renderAddView = () => (
        // (This function's JSX is unchanged)
        <>
            <h1 className="text-3xl font-bold text-[var(--artisan-dark)] mb-6 text-center">Create a New Product</h1>
            <p className="text-center text-gray-600 mb-8">Provide an image and an audio description. Our AI will do the rest.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col items-center">
                    <label className="font-bold text-lg mb-2 text-[var(--artisan-dark)]">1. Product Image</label>
                    <div className="w-full h-64 border-2 border-dashed rounded-lg flex items-center justify-center bg-yellow-50 overflow-hidden">
                        {imagePreview ? <img src={imagePreview} alt="Product Preview" className="h-full w-full object-cover"/> : <span className="text-gray-500">Image Preview</span>}
                    </div>
                    <label htmlFor="image-upload" className="mt-4 cursor-pointer flex items-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100"><FaUpload /> Upload Image</label>
                    <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </div>
                <div className="flex flex-col items-center">
                    <label className="font-bold text-lg mb-2 text-[var(--artisan-dark)]">2. Audio Description</label>
                    <div className="w-full bg-yellow-50 p-4 rounded-lg">
                        <div className="flex border-b border-yellow-200 mb-4">
                            <button onClick={() => setAudioMode('record')} className={`flex-1 py-2 ${audioMode === 'record' ? 'text-[var(--artisan-dark)] font-bold border-b-2 border-[var(--artisan-dark)]' : 'text-gray-600'}`}>Record Audio</button>
                            <button onClick={() => setAudioMode('upload')} className={`flex-1 py-2 ${audioMode === 'upload' ? 'text-[var(--artisan-dark)] font-bold border-b-2 border-[var(--artisan-dark)]' : 'text-gray-600'}`}>Upload File</button>
                        </div>
                        {audioMode === 'record' ? (
                            <div className="flex flex-col items-center justify-center h-48">
                                {!isRecording ? <button onClick={startRecording} className="flex items-center justify-center gap-2 text-white bg-red-600 hover:bg-red-700 rounded-full w-32 h-12"><FaMicrophone /> Record</button> : <button onClick={stopRecording} className="flex items-center justify-center gap-2 text-white bg-gray-700 hover:bg-gray-800 rounded-full w-32 h-12 animate-pulse"><FaStopCircle /> Stop</button>}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-48">
                                <label htmlFor="audio-upload" className="cursor-pointer flex items-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100"><FaUpload /> Select Audio File</label>
                                <input id="audio-upload" type="file" accept="audio/*" className="hidden" onChange={handleAudioFileChange} />
                            </div>
                        )}
                        {audioUrl && <audio src={audioUrl} controls className="w-full mt-4"/>}
                    </div>
                </div>
            </div>
            <div className="mt-8 flex justify-center gap-4">
                <button onClick={() => setView("list")} className="bg-gray-300 text-gray-800 py-2 px-8 rounded-lg hover:bg-gray-400">Cancel</button>
                <button onClick={handleGenerateDraft} disabled={!imageFile || !audioFile} className="bg-[var(--artisan-dark)] text-white py-2 px-8 rounded-lg hover:bg-[var(--artisan-brown)] disabled:bg-gray-400 disabled:cursor-not-allowed">Generate Draft</button>
            </div>
        </>
    );
    const renderEditView = () => {
        // (This function's JSX is unchanged)
        if (!draftProduct) return <p>Loading draft...</p>;
        const EditableList = ({ fieldName, title, inputId }) => (
            <div className="mb-4">
                <label className="font-bold text-gray-700">{title} {(!draftProduct[fieldName] || draftProduct[fieldName].length === 0) && <span className="text-red-500 text-xs ml-2">(Required)</span>}</label>
                <div className="space-y-2 mt-2">
                    {(draftProduct[fieldName] || []).map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input type="text" value={item} onChange={(e) => handleListChange(fieldName, index, e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg" />
                            <button onClick={() => removeListItem(fieldName, index)} className="text-red-500 hover:text-red-700 p-2"><FaTrash/></button>
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <input type="text" id={inputId} placeholder={`Add new ${title.slice(0, -1).toLowerCase()}`} className="w-full border border-gray-300 p-2 rounded-lg" value={newItemValues[fieldName]} onChange={(e) => handleNewItemChange(fieldName, e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addListItem(fieldName); } }} />
                    <button onClick={() => addListItem(fieldName)} className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300"><FaPlus/></button>
                </div>
            </div>
        );
        return (
            <>
                <h1 className="text-3xl font-bold text-[var(--artisan-dark)] mb-2 text-center">Review Your Draft</h1>
                <p className="text-center text-gray-600 mb-8">Please fill in any missing details before saving.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <img src={draftProduct.imageUrl} alt="Draft" className="rounded-lg shadow-lg mb-6 w-full"/>
                        <div className="mb-4">
                            <label htmlFor="title" className="font-bold text-gray-700">Title {!draftProduct.title?.trim() && <span className="text-red-500 text-xs ml-2">(Required)</span>}</label>
                            <input type="text" name="title" value={draftProduct.title || ''} onChange={handleDraftChange} className={`w-full border p-2 mt-1 rounded-lg ${!draftProduct.title?.trim() ? 'border-red-400' : 'border-gray-300'}`} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="font-bold text-gray-700">Description {!draftProduct.description?.trim() && <span className="text-red-500 text-xs ml-2">(Required)</span>}</label>
                            <textarea name="description" value={draftProduct.description || ''} onChange={handleDraftChange} rows="5" className={`w-full border p-2 mt-1 rounded-lg ${!draftProduct.description?.trim() ? 'border-red-400' : 'border-gray-300'}`} />
                        </div>
                    </div>
                    <div>
                        <EditableList fieldName="keyFeatures" title="Key Features" inputId="new-feature-input"/>
                        <EditableList fieldName="materials" title="Materials" inputId="new-material-input"/>
                        <div className="mb-4">
                            <label htmlFor="careInstructions" className="font-bold text-gray-700">Care Instructions {!draftProduct.careInstructions?.trim() && <span className="text-red-500 text-xs ml-2">(Required)</span>}</label>
                            <textarea name="careInstructions" value={draftProduct.careInstructions || ''} onChange={handleDraftChange} rows="3" className={`w-full border p-2 mt-1 rounded-lg ${!draftProduct.careInstructions?.trim() ? 'border-red-400' : 'border-gray-300'}`} />
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex justify-center gap-4">
                    <button onClick={() => setView("add")} className="bg-gray-300 text-gray-800 py-2 px-8 rounded-lg hover:bg-gray-400">Back</button>
                    <button onClick={handleSaveProduct} className="flex items-center gap-2 bg-[var(--artisan-dark)] text-white py-2 px-8 rounded-lg hover:bg-[var(--artisan-brown)]"><FaSave/> Save Product</button>
                </div>
            </>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-8">
            <div className="max-w-7xl mx-auto bg-white/70 backdrop-blur-sm shadow-2xl rounded-2xl p-8">
                {view === "list" && renderListView()}
                {view === "add" && renderAddView()}
                {view === "edit" && renderEditView()}
            </div>
        </div>
    );
};

export default ProductDashboard;