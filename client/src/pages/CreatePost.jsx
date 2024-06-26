import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import preview from "../assets/preview.png";
import { getRandomPrompt } from "../utils";
import { FormField, Loader } from "../components";

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: "",
  });
  const [generatingImage, setgeneratingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch(
          "https://ai-image-gen-ojxe.onrender.com/api/v1/post",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...form }),
          }
        );
        await response.json();
        navigate("/");

        alert("Success");
      } catch (error) {
        alert("Error");
        console.log(error);
      }
      setLoading(false);
    } else {
      alert("Please enter a prompt to generate the image");
    }
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const generateImage = async () => {
    if (form.prompt) {
      setgeneratingImage(true);
      const response = await fetch(
        "https://ai-image-gen-ojxe.onrender.com/api/v1/dalle",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: form.prompt }),
        }
      );
      const data = await response.json(); //till response will not come data will also have to wait
      const imageUrl = data.imageUrl;
      console.log(data);
      setForm({ ...form, photo: imageUrl });
      setgeneratingImage(false);
    } else {
      alert("Please enter a prompt to generate the image");
    }
  };
  const handleSupriseMe = (e) => {
    e.preventDefault();
    const random = getRandomPrompt();

    setForm({ ...form, prompt: random });
  };
  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          design your own image 🥳
        </h1>
        <p className="mt-2 text-[#666e75] text-[14px] max-w[500px]">
          type your imaginative prompts and get visually stunning images
          generated by image-gen
        </p>
      </div>

      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            LabelName="Your Name"
            type="text"
            name="name"
            placeholer="John Doe"
            value={form.name}
            handleChange={handleChange}
          />
          <FormField
            LabelName="Prompt"
            type="text"
            name="prompt"
            placeholder="an astronaut lounging in a tropical resort in space, vaporwave"
            value={form.prompt}
            handleChange={handleChange}
            isSupriseMe //as we are using same component for both so we are using this because we want to show surprise me button only for prompt
            handleSupriseMe={handleSupriseMe}
          />
          <div className="relative">
            {form.photo ? (
              <img
                src={form.photo}
                alt="preview"
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <img
                src={preview}
                className="w-full h-[300px] object-contain rounded-lg opacity-50"
              />
            )}
            {generatingImage && (
              <div className="absolute inset-0 z-0 flex justify-center items-center rounded-lg bg-[rgba(0,0,0,0.5)]">
                <Loader />
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className="text-white bg-green-500 rounded-lg px-6 py-2 font-medium w-full sm:w-auto text-center"
          >
            {generatingImage ? "Generating Image..." : "Generate Image"}
          </button>
        </div>
        <div className="mt-10">
          <p className="mt-2 text-[#666e75]">
            Once, you have created the image,you can share it with others in the
            community
          </p>
          <button
            type="submit"
            className="text-white bg-red-500 rounded-lg px-6 py-2 font-medium w-half text-center mt-5"
          >
            {loading ? "Creating Post..." : "Share Post"}
          </button>
        </div>
      </form>
    </section>
  );
};
export default CreatePost;
