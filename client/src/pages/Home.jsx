import React, { useEffect, useState } from "react";
import { Loader, FormField, Card } from "../components";

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />);
  }

  return (
    <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">{title}</h2>
  );
};

const Home = () => {
  const [loading, setloading] = useState(false);
  const [allPosts, setallPosts] = useState(null);
  const [searchedResults, setsearchedResults] = useState(null);

  const [searchText, setsearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchPosts = async () => {
    setloading(true);
    try {
      const response = await fetch("http://localhost:3000/api/v1/posts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const result = await response.json();
        setallPosts(result.data);
      }
    } catch (error) {
      alert(error);
      console.error(error);
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setsearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = allPosts.filter(
          (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.prompt.toLowerCase().includes(searchText.toLowerCase())
        );
        setsearchedResults(searchResult);
      }, 500)
    );
  };
  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          Welcome to{" "}
          <span className="text-[#6469ff]">The Community Showcase</span>
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[750px] ">
          Dive into a vibrant gallery of unique, AI-generated artwork crafted by
          our talented community. Explore, share, and download an array of
          stunning visuals that push the boundaries of creativity. Join us in
          celebrating the art of imagination brought to life by AI.
        </p>
      </div>
      <div className="mt-12">
        <FormField
          labelName="Search posts"
          type="text"
          name="text"
          placeholder="Search something..."
          value={searchText}
          handleChange={handleSearchChange}
        />
      </div>
      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666e75] text-xl mb-3">
                Showing results for
                <span className="text-[#222328]"> {searchText}</span>
              </h2>
            )}
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
              {searchText ? (
                <RenderCards
                  data={searchedResults}
                  title="No search results found"
                />
              ) : (
                <RenderCards data={allPosts} title="No Posts found" />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
