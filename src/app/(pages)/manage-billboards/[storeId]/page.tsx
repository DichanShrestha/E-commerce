"use client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useUserStore } from "@/store/useUserStore";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

const ManageBillBoard = () => {
  const [image, setImage] = useState<File | null | string>(null);
  const [label, setLabel] = useState<string>("");
  // for cloudinary uploaded images
  const [publicId, setPublicId] = useState<string>("");
  const [imageURL, setImageURL] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { store, storeId } = useUserStore();

  const searchParams = useSearchParams();
  const imageURLUpdate = searchParams.get("imageURL");
  const labelUpdate = searchParams.get("label");

  useEffect(() => {
    if (imageURLUpdate) {
      setImageURL(imageURLUpdate);
    }
    if (labelUpdate) {
      setLabel(labelUpdate);
    }
  }, [imageURLUpdate, labelUpdate]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
      setError("");
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      handleDelete();
      try {
        const response = await axios.post("/api/cloudinary", formData);
        setPublicId(response.data.data.public_id);
        console.log(publicId);

        setImageURL(response.data.data.url);
      } catch (error) {
        console.log("error while uploading image: ", error);
      }
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete("/api/cloudinary", {
        data: { public_id: publicId },
        headers: {
          "Content-Type": "application/json",
        },
      });
      setPublicId("");
      setImage(null);
      setMessage(response.data.message || "Image deleted successfully");
    } catch (error: any) {
      if (error.response) {
        // Server responded with a status other than 200 range
        setMessage(error.response.data.error || "An error occurred");
      } else if (error.request) {
        // Request was made but no response was received
        setMessage("No response from server");
      } else {
        // Something else happened while setting up the request
        setMessage("An unexpected error occurred");
      }
    }
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };

  const handleCreate = async () => {
    try {
      setIsLoading(true);

      if (!imageURL) {
        setError("Image is missing");
        return;
      }
      if (!label) {
        setError("Label is missing");
        return;
      }
      console.log(publicId);

      const formData = new FormData();
      formData.append("imageURL", imageURL);
      formData.append("publicId", publicId);
      formData.append("label", label);
      formData.append("store", store);

      const response = await axios.post(
        `/api/billboards/${storeId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error: any) {
      if (error.response) {
        // Server responded with a status other than 200 range
        setMessage(error.response.data.error || "An error occurred");
      } else if (error.request) {
        // Request was made but no response was received
        setMessage("No response from server");
      } else {
        // Something else happened while setting up the request
        setMessage("An unexpected error occurred");
      }
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);

      if (!imageURL && !label) {
        setError("Image or label is required");
        return;
      }

      const payload = {
        id: searchParams.get("id"),
        ...(imageURL && { updatedImageURL:imageURL }),
        ...(label && { updatedLabel: label }),
      };

      const response = await axios.patch(`/api/billboards/${storeId}`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error: any) {
      setMessage("Error updating billboard");
      if (error.response) setMessage(error.response.data.error);
      else if (error.request) setMessage("No response from server");
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div>
        <Header
          name="Manage Billboards"
          desc="Manage billboards for your store"
          isEnabled={false}
        />
      </div>
      <div className="mx-10">
        <div className="w-[800px] flex justify-between">
          <div>
            <Label>Background Image</Label>
            <Input type="file" className="mt-2" onChange={handleImageChange} />
            {error === "Image is missing" ? (
              <span className="text-red-700 text-xs">{error}</span>
            ) : (
              ""
            )}
          </div>
          <div>
            <Label>Label</Label>
            <Input
              type="text"
              className="mt-2"
              value={label}
              onChange={handleLabelChange}
            />
            {error === "Label is missing" ? (
              <span className="text-red-700 text-xs">{error}</span>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="my-5">
          <Button
            variant="outline"
            onClick={
              labelUpdate || imageURLUpdate ? handleUpdate : handleCreate
            }
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Loading
              </>
            ) : labelUpdate || imageURLUpdate ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </div>
        <div>
          <div className="mt-4 flex flex-col items-center relative">
            {imageURL && (
              <>
                <h2 className="text-sm">Your billboard will look like this</h2>
                <div className="relative w-full">
                  <img
                    src={imageURL}
                    alt="Billboard preview"
                    className="w-full h-64 object-cover rounded-md shadow-md"
                  />
                </div>
              </>
            )}
            <div className="absolute inset-0 flex justify-center items-center">
              <div>
                <span className="text-3xl font-semibold text-black">
                  {label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBillBoard;
