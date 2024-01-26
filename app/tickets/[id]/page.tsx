import { notFound } from "next/navigation"

export const dynamicParams = true

export async function generateStaticParams() {
  const res = await fetch('http://localhost:4000/tickets/')

  const tickets = await res.json()

  return tickets.map((ticket: any ) => ({
    id: ticket.id
  }))
   
}

async function getTicket(id: any) {
  // imitate delay
  // await new Promise(resolve => setTimeout(resolve, 3000))
  
  const res = await fetch ('http://localhost:4000/tickets/' + id, {
    next: {
      revalidate: 30 // use 0 to opt out of using cache
    }
  })
  
  if(!res.ok) { 
    notFound()
  }

  return res.json()
}
export default async function TicketDetails({ params }: { params: any }) {
  const ticket = await getTicket(params.id as any)

  return (
    <main>
      <nav>
        <h2>Ticket Details</h2>
      </nav>
      <div className="card">
        <h3>{ ticket.title }</h3>
        <small>Created by { ticket.user_email }</small>
        <p>{ ticket.body }</p>
        <div className={`pill ${ticket.priority}`}>
          { ticket.priority } priority
        </div>
      </div>
    </main>
  )
}