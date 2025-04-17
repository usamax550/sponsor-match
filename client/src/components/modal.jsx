import { useState } from "react";

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  saveText,
  onSubmit,
  imageModal,
}) => {
  if (!isOpen) return null;

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className={`relative bg-white p-6 py-2 border border-primary rounded-lg shadow-lg ${
          imageModal ? "max-w-4xl" : "max-w-2xl"
        } min-w-[600px] max-md:min-w-[500px] max-sm:min-w-[300px]`}
      >
        {/* Heading */}
        {imageModal ? null : (
          <div className="flex justify-center items-center p-2">
            <h3 className="font-bold text-xl">{title || "Post Your Ad"}</h3>
          </div>
        )}

        {/* Body */}
        {children}

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t gap-2">
          {!imageModal && (
            <button
              className={`text-white px-12 py-2 rounded-lg ${
                isLoading ? "bg-gray-400" : "bg-primary"
              }`}
              disabled={isLoading}
            >
              {saveText || "Post"}
            </button>
          )}
          <button
            className={`text-black px-12 py-2 rounded-lg border-gray-500 border ${
              isLoading ? "bg-gray-400" : "bg-white"
            }`}
            disabled={isLoading}
            onClick={onClose}
            type="button"
          >
            {imageModal ? "Close" : "Cancel"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Modal;
