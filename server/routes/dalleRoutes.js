import express from "express";
import * as dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.route("/").get((req, res) => {
  res.status(200).json({ message: "Hello from VERSE-2-PIC!" });
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log(prompt);
    const randomSeed = Math.floor(Math.random() * 214);

    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_AUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
          width: 1024,
          height: 1024,
          num_steps: 200,
          guidance: 10.5,
          seed: randomSeed,
          init_image: null,
          image2image_strength: 0.0,
          add_sampling_metadata: true,
          response_format: "arrayBuffer",
        }),
      }
    );

    response.arrayBuffer().then((buffer) => {
      const base64Image = Buffer.from(buffer).toString("base64");
      const image = `data:image/jpeg;base64,${base64Image}`;
      res.status(200).json({ photo: image });
    });
  } catch (error) {
    console.error(error);
    res.status(500);
    const errorMessage =
      error?.response?.data?.error?.message || "Something went wrong";
    res.status(500).send(errorMessage);
  }
});

export default router;
