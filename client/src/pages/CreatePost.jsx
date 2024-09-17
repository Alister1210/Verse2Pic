import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { preview } from "../assets";
import { getRandomPrompt } from "../utils";
import { FormField, Loader } from "../components";

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setform] = useState({
    name: "",
    prompt: "",
    photo: "",
  });
  const [generatingImg, setgeneratingImg] = useState(false);
  const [loading, setloading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.prompt && form.photo) {
      setloading(true);
      try {
        const response = await fetch(
          "https://verse2pic-server.onrender.com/api/v1/posts",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          }
        );
        await response.json();
        navigate("/");
      } catch (error) {
        alert(error);
        console.log(error);
      } finally {
        setloading(false);
      }
    } else {
      alert("Please fill out all fields");
    }
  };
  const generateImage = async () => {
    if (form.prompt) {
      try {
        setgeneratingImg(true);
        const response = await fetch(
          "https://verse2pic-server.onrender.com/api/v1/dalle",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: form.prompt }),
          }
        );
        const data = await response.json();

        setform({ ...form, photo: data.photo });
      } catch (error) {
        alert(error);
        console.log(error);
      } finally {
        setgeneratingImg(false);
      }
    } else {
      alert("Please enter a prompt");
    }
  };
  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };
  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setform({ ...form, prompt: randomPrompt });
  };
  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          Create Your Masterpiece
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[750px] ">
          Unleash your creativity with the power of AI. Describe your vision,
          and watch it transform into a stunning image in seconds. Whether it's
          a dreamy landscape, a futuristic city, or an abstract concept, let
          your imagination guide you. Ready to bring your ideas to life?
          Start creating now!
        </p>
      </div>

      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5 ">
          <FormField
            labelName="Your Name"
            name="name"
            type="text"
            placeholder="Alister"
            value={form.name}
            handleChange={handleChange}
          />
          <FormField
            labelName="Prompt"
            name="prompt"
            type="text"
            placeholder="A mobile phone flying in the sky with devilish wings"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg ">
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className="text-white bg-green-700 font-medium rounded-md text-sm w-full px-5 py-2.5 text-center sm:w-auto"
          >
            {generatingImg ? "Generating..." : "Generate"}
          </button>
        </div>
        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px] ">
            Once you have created the image, you can share it with the community
          </p>
          <button
            type="submit"
            className="text-white bg-[#6469ff] font-medium rounded-md text-sm w-full px-5 py-2.5 text-center sm:w-auto"
          >
            Share with Community
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
