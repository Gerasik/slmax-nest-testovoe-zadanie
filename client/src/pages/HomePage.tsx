import React, { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/authContext"
import { useNavigate } from "react-router-dom"
import { gql, useMutation, useQuery } from "@apollo/client"

const MESSAGE_SUBSCRIPTION = gql`
  subscription Subscription {
    messageCreated {
      id
      createdAt
      createdBy
      text
      room
    }
  }
`

const GET_MESSAGES = gql`
  query Query {
    messages {
      id
      createdAt
      createdBy
      text
      room
    }
  }
`

const CREATE_MESSAGE = gql`
  mutation Mutation($messageInput: MessageInput) {
    createMessage(messageInput: $messageInput) {
      createdAt
      createdBy
      text
    }
  }
`

interface IMessage {
  room: number
  id: number
  createdAt: string
  createdBy: string
  text: string
}

interface IMessageByRoom {
  [key: number]: IMessage[]
}

const HomePage: React.FC = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [newText, setText] = useState("")
  const [messagesByRoom, setMessagesByRoom] = useState<IMessageByRoom>({})
  console.log("🚀 ~ file: HomePage.tsx:57 ~ messagesByRoom:", messagesByRoom)

  useEffect(() => {
    if (!user) {
      navigate("/login")
    }
  }, [navigate, user])
  const { subscribeToMore, data } = useQuery<{ messages: IMessage[] }>(
    GET_MESSAGES
  )

  const [currentRoom, setCurrentRoom] = useState(0)

  const [createMessage] = useMutation(CREATE_MESSAGE)

  useEffect(() => {
    if (data?.messages) {
      const newObg = data?.messages.reduce<IMessageByRoom>((acc, item) => {
        if (acc[item.room]) {
          acc[item.room] = [...acc[item.room], item]
        } else {
          acc[item.room] = [item]
        }
        return acc
      }, {})
      setMessagesByRoom(newObg)
    }
  }, [data])

  useEffect(
    () =>
      subscribeToMore({
        document: MESSAGE_SUBSCRIPTION,
        updateQuery: (
          prev,
          {
            subscriptionData,
          }: { subscriptionData: { data: { messageCreated: IMessage } } }
        ) => {
          console.log(
            "🚀 ~ file: HomePage.tsx:59 ~ subscriptionData:",
            subscriptionData
          )
          if (!subscriptionData.data) return prev

          return {
            messages: [
              ...prev.messages,
              subscriptionData.data.messageCreated as IMessage,
            ],
          }
        },
      }),
    [subscribeToMore]
  )

  const createRoom = (id?: number) => {
    if (id) {
      setCurrentRoom(id)
      return
    }
    if (!currentRoom) {
      setCurrentRoom(1)
    } else {
      const newRoom =
        Math.max.apply(
          null,
          Object.keys(messagesByRoom).map((k) => +k)
        ) + 1

      setCurrentRoom(newRoom)
    }
  }
  console.log(
    "🚀 ~ file: HomePage.tsx:117 ~ createRoom ~ currentRoom:",
    currentRoom
  )

  return (
    <div className="flex">
      <div className="w-1/5 flex flex-col gap-5 ">
        {Object.keys(messagesByRoom).map((key) => (
          <button
            onClick={() => createRoom(+key)}
            key={key}
            className="pointer px-5 py-2 rounded-md border-2 bg-orange-100 hover:bg-orange-400 transition-all"
          >
            {key} (messages:{messagesByRoom[+key].length})
          </button>
        ))}
        <button
          onClick={() => createRoom()}
          className="pointer px-5 py-2 rounded-md border-2 hover:bg-fuchsia-400 transition-all"
        >
          Create room
        </button>
      </div>
      <div className="w-4/5 bg-slate-200 p-5">
        {(!!data?.messages.length || !!currentRoom) && (
          <>
            <ul className="flex gap-2 flex-col items-end">
              {messagesByRoom[currentRoom] &&
                messagesByRoom[currentRoom].map((mess) => (
                  <li
                    key={mess.createdAt}
                    className="px-5 py-2 rounded-lg bg-white flex-col flex items-end"
                  >
                    <span className="text-sm text-slate-500">
                      {mess.createdBy}
                    </span>
                    <p>{mess.text}</p>
                  </li>
                ))}
            </ul>
            <div className="mt-5 flex gap-5">
              <input
                className="flex-1"
                type="text"
                value={newText}
                onChange={(e) => setText(e.target.value)}
              />
              <button
                className="pointer px-5 py-2 rounded-md border-2 bg-fuchsia-100 hover:bg-fuchsia-400 transition-all"
                onClick={() => {
                  createMessage({
                    variables: {
                      messageInput: {
                        username: user?.username,
                        text: newText,
                        room: currentRoom,
                      },
                    },
                  })
                  setText("")
                }}
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default HomePage
