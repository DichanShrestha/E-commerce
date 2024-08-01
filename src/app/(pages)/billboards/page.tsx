import Header from '@/components/Header';
import { Input } from '@/components/ui/input';
import { Payment, columns } from "./columns"
import { DataTable } from "./data-table"
 
async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ]
}
const Billboards = async () => {
  const data = await getData()
  return (
    <div>
      <Header name='Billboards' stocks={3} desc='Manage billboards for your store' route='/manage-billboards'/>
      <div className='mx-10 my-3'>
      <DataTable />
      </div>
    </div>
  )
}

export default Billboards;