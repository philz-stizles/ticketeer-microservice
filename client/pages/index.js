import React from 'react'
import Link from 'next/link'

const IndexPage = ({ currentUser, tickets }) => {
  console.log(tickets)
  const renderTickets = tickets =>
    tickets.map(({ id, title, price }) => {
      return (
        <tr key={id}>
          <td>{title}</td>
          <td>{price}</td>
          <td>
            <Link href="/tickets/[ticketId]" as={`/tickets/${id}`}>
              <a>View</a>
            </Link>
          </td>
        </tr>
      )
    })

  return (
    <div>
      <h1 className="mb-3">Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{renderTickets(tickets)}</tbody>
      </table>
    </div>
  )
}

IndexPage.getInitialProps = async (ctx, client, currentUser) => {
  const { data } = await client.get('/api/tickets')

  return {
    tickets: data,
  }
}

export default IndexPage
