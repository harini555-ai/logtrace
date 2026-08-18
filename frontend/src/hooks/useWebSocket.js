import { useCallback, useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'http://localhost:8080/ws-logtrace'

/**
 * Manages a STOMP-over-SockJS connection to LogTrace's backend and
 * subscribes to a given topic (defaults to the global live-tail topic).
 *
 * @param {Object} options
 * @param {string} [options.topic] STOMP destination, e.g. '/topic/logs/all'
 * @param {boolean} [options.paused] when true, incoming messages are ignored
 * @param {(msg: any) => void} options.onMessage callback invoked for each log
 */
export default function useWebSocket({ topic = '/topic/logs/all', paused = false, onMessage }) {
  const [connected, setConnected] = useState(false)
  const clientRef = useRef(null)
  const subscriptionRef = useRef(null)
  const pausedRef = useRef(paused)
  const onMessageRef = useRef(onMessage)

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_BASE_URL),
      reconnectDelay: 4000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        setConnected(true)
        subscriptionRef.current = client.subscribe(topic, (message) => {
          if (pausedRef.current) return
          try {
            const payload = JSON.parse(message.body)
            onMessageRef.current?.(payload)
          } catch (err) {
            console.error('Failed to parse incoming log message', err)
          }
        })
      },
      onDisconnect: () => setConnected(false),
      onWebSocketClose: () => setConnected(false),
      onStompError: (frame) => {
        console.error('STOMP protocol error', frame.headers?.message, frame.body)
      },
    })

    clientRef.current = client
    client.activate()

    return () => {
      subscriptionRef.current?.unsubscribe()
      client.deactivate()
      setConnected(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic])

  const disconnect = useCallback(() => {
    clientRef.current?.deactivate()
  }, [])

  return { connected, disconnect }
}
