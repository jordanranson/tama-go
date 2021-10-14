import { ChangeEvent, useEffect, useReducer, useRef, useState } from 'react'
import './App.scss'
import TamaGo, { compileFromSource, Program } from './lib/TamaGo'


/*
 * Enums
 */

enum ProgramReducerMutation {
  COMPILE
}


/*
 * Types
 */

type ProgramReducerAction = {
  mutation: ProgramReducerMutation,
  payload: any
}


/*
 * Utility functions
 */

function ProgramReducer (state: Program, action: ProgramReducerAction) {
  switch (action.mutation) {
    case ProgramReducerMutation.COMPILE: {
      return {
        ...state,
        ...compileFromSource(action.payload)
      }
    }
  }

  return {
    ...state
  }
}


/*
 * React component
 */

export default function App () {
  const initialState: Program = {
    name: '',
    author: '',
    icons: [],
    cutout: undefined,
    storage: [],
    labels: {},
    tokens: []
  }

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tamagoRef = useRef<TamaGo | null>(null)
  const [program, dispatch] = useReducer(ProgramReducer, initialState)

  useEffect(() => {
    tamagoRef.current = new TamaGo()
    tamagoRef.current!.useCanvas(canvasRef.current!)

    return () => {
      tamagoRef.current!.pause()
    }
  }, [])

  useEffect(() => {
    tamagoRef.current!.loadProgram(program)
  }, [program])

  const updateSource = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ mutation: ProgramReducerMutation.COMPILE, payload: evt.target.value })
  }

  return (
    <div style={{display: 'flex'}}>
      <div>
        <textarea onChange={updateSource} spellCheck={false}></textarea>
      </div>
      <div>
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}
