import Header from "@/components/Header";
import axios from "axios";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("@/components/Chart"), { ssr: false });

async function getStoreData() {
  try {
    const response = await axios.get(`http://localhost:3001/api/get-sales-detail`);
    return response.data.data;  // Ensure you are returning the data
  } catch (error) {
    console.error("Error fetching sales data:", error);
    return null;  // Handle the case where data fetch fails
  }
}

export default async function Home() {
  const data = await getStoreData();
  
  const inventory = [
    {
      text: "Total Revenue",
      image: "savings",
      number: data ? `Rs ${data[0].totalPrice}` : "N/A", 
    },
    {
      text: "Sales",
      image: "indeterminate_check_box",
      number: data ? data[0].count : "N/A",
    },
    {
      text: "Products in Stock",
      image: "inventory_2",
      number: "20",
    },
  ];

  return (
    <div>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
      <Header name="Dashboard" isEnabled={false} desc="Overview of your store" />
      <div className="flex flex-col">
        <div className="flex justify-between mt-10 w-[650px] items-center mx-auto">
          {inventory.map((item) => (
            <div key={item.text}>
              <CardTemplate
                text={item.text}
                number={item.number}
                image={item.image}
              />
            </div>
          ))}
        </div>
        <div>
          <Chart className="mx-auto mt-10 w-[650px]" />
        </div>
      </div>
    </div>
  );
}

const CardTemplate = ({ text, image, number }: any) => (
  <div className="flex border-[1px] border-gray-500 h-auto w-52 p-4 rounded-md flex-col">
    <div className="flex justify-between">
      {text} <span className="material-symbols-outlined">{image}</span>
    </div>
    <div>{number}</div>
  </div>
);
