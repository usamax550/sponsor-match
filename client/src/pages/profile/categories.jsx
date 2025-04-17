import React, { useEffect, useMemo, useState } from "react";
import { useCategories } from "../../api/category";
import { MultiSelect } from "react-multi-select-component";
import { useAuth } from "../../context/auth.context";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const ProfileCategory = ({ isEditable = true, data = null }) => {
  const { data: categories, isLoading, isError } = useCategories();

  const [selected, setSelected] = useState([]);
  const { setUser, user } = useAuth();

  const filteredCategories = useMemo(() => {
    if (!categories || !user?.categories) return [];
    return categories.filter((category) => !user.categories.includes(category));
  }, [user?.categories]);

  const handleSubmit = async () => {
    const newData = selected.map((el) => el.value);
    const data = [...user.categories, ...newData];
    try {
      const response = await axiosInstance.put("/profile/update-profile", {
        categories: data,
      });
      setUser(response.data.data);
      setSelected([]);
    } catch (error) {
      toast.error(error?.data?.message || error.message || "Failed to update");
    }
  };

  const handleUnselect = async (e, value) => {
    const data = user.categories.filter((category) => category !== value);
    try {
      const response = await axiosInstance.put("/profile/update-profile", {
        categories: data,
      });
      setUser(response.data.data);
      setSelected([]);
    } catch (error) {
      toast.error(error?.data?.message || error.message || "Failed to update");
      e.target.checked = true;
      e.target.disabled = false;
    }
  };

  if (isLoading) {
    return <>Loading....</>;
  }

  if (isError) {
    return <>Error Loading...</>;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h4 className="font-bold">Product Category</h4>
      </div>
      {isEditable && (
        <div className="flex gap-2">
          <MultiSelect
            options={filteredCategories.map((category) => ({
              label: category,
              value: category,
            }))}
            value={selected}
            onChange={setSelected}
            labelledBy="Categories"
            className="w-80"
          />
          <button
            onClick={handleSubmit}
            disabled={selected.length === 0}
            className={`btn-primary bg-primary w-40 disabled:bg-slate-300 disabled:hover:brightness-100`}
          >
            Add Categories
          </button>
        </div>
      )}
      <ul className="flex gap-4 flex-wrap">
        {isEditable &&
          user?.categories?.map((category, index) => (
            <li key={category} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`${category}`}
                // disabled
                className="w-4 h-4 rounded border-gray-300"
                defaultChecked
                value={category}
                onChange={(e) => {
                  e.target.disabled = true;
                  if (e.target.checked) {
                    e.target.disabled = false;
                  } else {
                    handleUnselect(e, e.target.value);
                  }
                }}
              />
              <label
                htmlFor={`${category}`}
                className="text-gray-800 cursor-pointer"
              >
                {category}
              </label>
            </li>
          ))}
        {!isEditable &&
          data?.map((category) => (
            <li key={`view-${category}`} className="flex items-center gap-2">
              <label className="text-gray-800 ">{category}</label>
            </li>
          ))}
      </ul>
    </>
  );
};

export default ProfileCategory;
