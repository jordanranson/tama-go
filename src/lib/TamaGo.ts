/*
 * Constants
 */

// Specifications
export const CLOCK_SPEED = 96000
export const MEMORY_SIZE = 3200
export const STORAGE_SIZE = 65536
export const DISPLAY_WIDTH = 32
export const DISPLAY_HEIGHT = 16

// Memory map addresses
export const MEM_STACK_ADDR = 0
export const MEM_STACK_LEN = 256
export const MEM_BUTTON_ADDR = 512
export const MEM_BUTTON_LEN = 3
export const MEM_AUDIO_ADDR = 520
export const MEM_AUDIO_LEN = 2
export const MEM_ICON_ADDR = 524
export const MEM_ICON_LEN = 1
export const MEM_TIMER_ADDR = 526
export const MEM_TIMER_LEN = 1
export const MEM_SERIAL_STATE_ADDR = 528
export const MEM_SERIAL_STATE_LEN = 2
export const MEM_SERIAL_PIN_ADDR = 544
export const MEM_SERIAL_PIN_LEN = 16
export const MEM_VIDEO_ADDR = 640
export const MEM_VIDEO_LEN = 512
export const MEM_SAVE_DATA_ADDR = 1152
export const MEM_SAVE_DATA_LEN = 256
export const MEM_IMAGE_DATA_ADDR = 1408
export const MEM_IMAGE_DATA_LEN = 512

// Convenience values
export const LOW = 0x00
export const HIGH = 0xff


/*
 * Enumerators
 */

export enum InstructionCode {
  /*
   * Notes:
   * - Anytime a value is 'pushed' to the Stack, STACK_INDEX will be incremented by 1 unless otherwise noted
   * - Anytime a 'jump' instruction is executed, the value of the Program Counter will be pushed to the Stack, and the index copied to RETURN_INDEX
   */

  /* Stack operations */
  CONST = 1,
  // Sets the last value on the Stack to `value`
  // `CONST <value: Integer>`
  PUSH,
  // Pushes `value` onto the Stack
  // `PUSH <value: Integer>`
  PUSHR,
  // Pushes the value of `register` onto the Stack
  // `PUSH <register: Symbol>`
  POP,
  // Copies the last value of the Stack to `register` and decrements STACK_INDEX
  // `POP <register: Symbol>`
  COPY,
  // Copies the last value of the Stack to `register`
  // `COPY <register: Symbol>`
  INCR,
  // Increments STACK_INDEX by `value`
  // `INCR <value: Integer>`
  DECR,
  // Decrements STACK_INDEX by `value`
  // `DECR <value: Integer>`

  /* Arthimetic operations */
  ADD,
  // Pushes to the Stack the result of adding the last two values on the Stack
  // `ADD`
  SUB,
  // Pushes to the Stack the result of subtracting the last two values on the Stack
  // `SUB`
  MUL,
  // Pushes to the Stack the result of multiplying the last two values on the Stack
  // `MUL`
  DIV,
  // Pushes to the Stack the result of dividing (rounded) the last two values on the Stack
  // `DIV`
  MOD,
  // Pushes to the Stack the modulo the last two values on the Stack
  // `MOD`
  RAND,
  // TODO
  SIN,
  // TODO
  COS,
  // TODO

  /* Bitwise operations */
  AND,
  // Pushes to the Stack the result bitwise anding the last two values on the Stack
  // `AND`
  OR,
  // Pushes to the Stack the result bitwise oring the last two values on the Stack
  // `OR`
  XOR,
  // Pushes to the Stack the result bitwise xoring the last two values on the Stack
  // `XO`
  NOT,
  // Pushes to the Stack the result bitwise noting the top of the Stack
  // `NOT`
  LSHFT,
  // Pushes to the Stack the result left-shifting the last two values on the Stack
  // `LSHFT`
  RSHFT,
  // Pushes to the Stack the result right-shifting the last two values on the Stack
  // `RSHFT`

  /* Register operations */
  SET,
  // Copies `value` to DATA_BUFFER_A
  // `SET <value: Integer>`
  GET,
  // Copies the value from `register` to DATA_BUFFER_A
  // `GET <register: Symbol>
  MOV,
  // Copies the value from DATA_BUFFER_A to `register`
  // `MOV <register: Symbol>`

  /* Memory operations */
  MADDR,
  // Copies the the index of the last value on the Stack to MEMORY_POINTER
  // `MADDR`
  PEEK,
  // Copies the value from the Memory Pointer address to MEMORY_BUFFER_A
  // `PEEK`
  POKE,
  // Copies the value from MEMORY_BUFFER_A to the Memory Pointer address
  // `POKE`

  /* Save Data operations */
  SAVE,
  // Copies Save Data from memory into Local Storage
  // `SAVE`
  LOAD,
  // Copies Save Data from Local Storage into memory
  // `LOAD`

  /* Storage operations */
  SADDR,
  // Copies the the index of the last value on the Stack to STORAGE_POINTER
  // `SADDR`
  READ,
  // Copy a range of values from Storage to the Memory Pointer address, starting at the Storage Pointer address
  // `READ <numberOfBytes: Integer>`

  /* Jump operations */
  GOTO,
  // Copies the the last two values on the Stack to PROGRAM_COUNTER_HIGH and PROGRAM_COUNTER_LOW
  // `GOTO`
  JUMP,
  // Copies the next two values in memory at the index specified by the address `label` refers too, to PROGRAM_COUNTER_HIGH and PROGRAM_COUNTER_LOW
  // `JUMP <label: String>`
  RTN,
  // Copies the next two values on the Stack at the index specified by RETURN_INDEX to PROGRAM_COUNTER_HIGH and PROGRAM_COUNTER_LOW
  // `RTN`
  JEQ,
  // Compares the last two values on the Stack; executes a 'jump' if the second last value equals the last value
  // `JEQ <label: String>`
  JNEQ,
  // Compares the last two values on the Stack; executes a 'jump' if the second last value does not equal the last value
  // `JNEQ <label: String>`
  JGT,
  // Compares the last two values on the Stack; executes a 'jump' if the second last value is greater than the last value
  // `JGT <label: String>`
  JGTE,
  // Compares the last two values on the Stack; executes a 'jump' if the second last value is greater than or equals the last value
  // `JGTE <label: String>`
  JLT,
  // Compares the last two values on the Stack; executes a 'jump' if the second last value is less than the last value
  // `JLT <label: String>`
  JLTE,
  // Compares the last two values on the Stack; executes a 'jump' if the second last value is less than or equals the last value
  // `JLTE <label: String>`

  /* Input operations */
  BTN,
  // Pushes the current state of the specified button to DATA_BUFFER_A; high value if just pressed
  // `BTN <whichButton: Integer>`
  BTND,
  // Pushes the current state of the specified button to DATA_BUFFER_A; high value if pressed
  // `BTND <whichButton: Integer>`

  /* Timer operations */
  TICK,
  // Pushes the current timer tick to DATA_BUFFER_A
  // `TICK`

  /* Serial port operations */
  PIN,
  // Copies the state of the specified `pinNumber` to DATA_BUFFER_A (0-15)
  // `PIN <pinNumber: Integer>`
  POUT,
  // Copies the value of DATA_BUFFER_A to the specified `pinNumber` (0-15)
  // `POUT <pinNumber: Integer>`
  SEND,
  // Sets pin 16 to HIGH and 17 to LOW, indicating to the serial connection that the device is sending; also sends HTTP request to URL specified in meta data
  // `SEND`
  RECV,
  //  Copies a HIGH value to DATA_BUFFER_A if pin 16 is LOW and 17 is HIGH, indicating that something has been sent; sets pins 16 and 17 to LOW
  // `RECV`

  /* Drawing operations */
  CLEAR,
  // Fills video memory with `shade`
  // `CLEAR <shade: Integer>`
  DRAW,
  // Uses last two values from the Stack as the X and Y positions to draw a pixel
  // `DRAW <shade: Integer>`
  SHADE,
  // Copies the shade of a pixel to DATA_BUFFER_A; uses last two values from the Stack as the X and Y positions
  // `SHADE`
  TILE,
  // Uses last two values from the Stack as the X and Y positions to draw a tile from storage or memory
  // `TILE <index: Integer>`
  SPR,
  // Uses last two values from the Stack as the X and Y positions to draw a sprite from storage or memory; shade 0 is transparent
  // `SPR <index: Integer>`
  ICON,
  // Uses the last value from the Stack to determine if the icon is selected; HIGH value for selected
  // `ICON <icon: Integer>`
  PRINT,
  // Uses last two values from the Stack as the X and Y positions
  // `PRINT <character: Integer>`

  /* Audio operations */
  TONE,
  // Copies the last two values on the stack to the Audio frequency memory address (0 is silent)
  // `TONE`

  /* Misc. operations */
  SLEEP,
  // Sets SLEEP_COUNTER to `numCycles`
  // `SLEEP <numCycles: Integer>`
  LOGR,
  // Logs `register` to the JavaScript console
  // `LOGR <register: Symbol>`
  LOGS,
  //  Logs the last value on the stack to the JavaScript console
  // `LOGS`
  NOP
  // No operation
  // `NOP`
}

export enum Register {
  DATA_BUFFER_A = 'xa',
  DATA_BUFFER_B = 'xb',
  INSTRUCTION_POINTER_HIGH = 'pch',
  INSTRUCTION_POINTER_LOW = 'pcl',
  STACK_INDEX = 'si',
  MEMORY_POINTER_HIGH = 'mph',
  MEMORY_POINTER_LOW = 'mpl',
  STORAGE_POINTER_HIGH = 'sph',
  STORAGE_POINTER_LOW = 'spl',
  RETURN_POINTER_HIGH = 'rph',
  RETURN_POINTER_LOW = 'rpl',
  SLEEP_COUNTER = 'sc',
  TIMER_PAUSED = 'tp',
  DRAW_FROM_MEMORY = 'dm',
  WRAP_VALUES = 'wv'
}

export const RegisterMap: { [key: string]: number } = Object
  .keys(Register)
  .reduce<{ [key: string]: number }>((acc, key, i) => (acc[(Register as any)[key]] = i, acc), {})

/*
 * Types
 */

export type Address = [
  number,
  number
]

export type Program = {
  name: string,
  author: string,
  icons: string[],
  cutout?: ImageData,
  storage: number[],
  labels: { [key: number]: Address },
  tokens: Token[]
}

export type Token = {
  instruction: InstructionCode,
  parameter?: number
}


/*
 * Utility functions
 */

export function clampByte (value: number) {
  if (value < 0) return 0
  if (value > 255) return 255

  return value
}

export function valueIsHigh (value: number) {
  return value >= 1
}

export function wordToNumber (byte0: number, byte1: number) {
  return (byte0 << 8) | (byte1 & 0xff)
}

export function numberToWord (number: number) {
  return [
    (number >> 8) & 0xff,
    (number >> 0) & 0xff
  ] as Address
}

export function arrayOfLength (length: number) {
  return Array.apply(null, Array(length)).map(() => 0)
}

export function compileFromSource (source: string) {
  const lines = source
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => !line.startsWith('#') && line !== '')

  const definitions: { [key: string]: number } = {}

  lines.forEach((line, index) => {
    let [instruction, parameter]: (string | number)[] = line.split(' ')
    instruction = instruction.toUpperCase()

    if (isNaN(Number(parameter)) || parameter === undefined) parameter = 0
    else parameter = Number(parameter)

    if (instruction.startsWith('$')) {
      instruction = instruction.toUpperCase()
      definitions[instruction] = parameter
    }
  })

  const tokens: Token[] = []

  const labelMap: { [key: string]: number } = {}
  const labels: { [key: number]: Address } = {}

  lines
    .filter((line) => !line.trim().startsWith('#'))
    .forEach((line, index) => {
      let [instruction, parameter]: (string | number)[] = line.trim().split(' ')
      instruction = instruction.toUpperCase()

      if (parameter === undefined)
        parameter = 0
      else if (typeof parameter === 'string' && parameter.startsWith('$'))
        parameter = definitions[parameter.toUpperCase()] || 0

      if (instruction.startsWith(':')) {
        instruction = instruction.replace(':', '')

        labelMap[instruction] = Object.keys(labels).length % 256
        labels[Object.keys(labels).length % 256] = numberToWord(index)

        tokens.push({ instruction: InstructionCode.NOP, parameter: Number(parameter) || 0 })
      } else {
        const instructionCode: InstructionCode = InstructionCode[instruction as keyof typeof InstructionCode] || InstructionCode.NOP

        switch (instructionCode) {
          case InstructionCode.JUMP:
          case InstructionCode.JEQ:
          case InstructionCode.JNEQ:
          case InstructionCode.JGT:
          case InstructionCode.JGTE:
          case InstructionCode.JLT:
          case InstructionCode.JLTE:
            tokens.push({ instruction: instructionCode, parameter: labelMap[parameter] || 0 })
            return
        }

        if (isNaN(Number(parameter))) {
          parameter = (RegisterMap[parameter] || 0) % 256
        } else {
          parameter = Number(parameter) % 256
        }

        tokens.push({ instruction: instructionCode, parameter })
      }
    })

  return { tokens, labels }
}


/*
 * Class
 */

export default class TamaGo {
  // Canvas
  canvas: HTMLCanvasElement | null = null
  context: CanvasRenderingContext2D | null = null
  shades: string[] = ['#BBC1CB', '#606E7C', '#2F3944']
    
  // Currently running program
  program?: Program

  // State
  running: boolean = false

  // 3 200 bytes of memory
  memory: number[] = arrayOfLength(3200)

  // 65 536 bytes of flash
  storage: number[] = arrayOfLength(65536)

  // Registers
  registers: { [key: string]: number } = {
    [Register.DATA_BUFFER_A]: 0,
    [Register.DATA_BUFFER_B]: 0,
    [Register.INSTRUCTION_POINTER_HIGH]: 0,
    [Register.INSTRUCTION_POINTER_LOW]: 0,
    [Register.STACK_INDEX]: 0,
    [Register.MEMORY_POINTER_HIGH]: 0,
    [Register.MEMORY_POINTER_LOW]: 0,
    [Register.STORAGE_POINTER_HIGH]: 0,
    [Register.STORAGE_POINTER_LOW]: 0,
    [Register.RETURN_POINTER_HIGH]: 0,
    [Register.RETURN_POINTER_LOW]: 0,
    [Register.SLEEP_COUNTER]: 0,
    [Register.TIMER_PAUSED]: 0,
    [Register.DRAW_FROM_MEMORY]: 0,
    [Register.WRAP_VALUES]: 0
  }

  // Private members
  private _loopHandler: any
  private _acc: number = 0
  private _lastNow: number = 0
  private _created: number = performance.now()
  private _lastAnimFrame: number = 0

  constructor () {
    this._loopHandler = this.loop.bind(this)

    this.storage.fill(0)
    this.reset()
  }

  useCanvas (canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.canvas.width = DISPLAY_WIDTH
    this.canvas.height = DISPLAY_HEIGHT
    this.context = this.canvas.getContext('2d')
  }

  loadProgram (program: Program) {
    this.pause()

    this.reset()
    this.storage.fill(0)

    this.program = program

    this.writeToStorage(0, this.program.storage)

    this.program.tokens.forEach((token, i) => {
      this.writeToStorage(0 + i * 2, [token.instruction, token.parameter || 0])
    })

    this.run()
  }

  reset () {
    // Reset registers
    for (let register in this.registers) {
      this.registers[register] = 0
    }

    // Empty memory
    this.memory.fill(0)
  }

  run () {
    if (this.running) return

    this.running = true
    this.loop()
  }

  pause () {
    cancelAnimationFrame(this._lastAnimFrame)
    this.running = false
  }

  loop () {
    if (!this.running) return

    this._lastAnimFrame = requestAnimationFrame(this._loopHandler)

    const now = performance.now() - this._created
    const delta = now - this._lastNow
    this._acc += delta
    this._lastNow = now

    const tickLen = 1000 / 30

    while (this._acc > tickLen) {
      this._acc -= tickLen

      const numCycles = Math.round(CLOCK_SPEED / tickLen)
      for (let i = 0; i < numCycles; i++) {
        if (this.runCycle() === 0) break
      }
    }

    if (this.canvas && this.context) this.draw()
  }

  draw () {
    this.context!.clearRect(0, 0, DISPLAY_WIDTH, DISPLAY_WIDTH)

    const bytes = this.readFromMemory(MEM_VIDEO_ADDR, MEM_VIDEO_LEN)
    for (let i = 0; i < bytes.length; i++) {
      const x = i % DISPLAY_WIDTH
      const y = Math.floor(i / DISPLAY_WIDTH)

      const shade = bytes[i]

      if (shade === 0) {
        this.context!.clearRect(x, y, 1, 1)
      } else {
        this.context!.fillStyle = this.shades[shade - 1]
        this.context!.fillRect(x, y, 1, 1)
      }
    }
  }

  runCycle () {
    const instructionIndex = wordToNumber(this.getRegister(Register.INSTRUCTION_POINTER_HIGH), this.getRegister(Register.INSTRUCTION_POINTER_LOW))
    const instructionCode = this.storage[instructionIndex * 2]

    const sleepCounter = this.getRegister(Register.SLEEP_COUNTER)
    if (sleepCounter > 0) {
      this.setRegister(Register.SLEEP_COUNTER, sleepCounter - 1)
      return instructionCode
    }

    if (instructionCode === 0) {
      this.setRegister(Register.INSTRUCTION_POINTER_HIGH, 0)
      this.setRegister(Register.INSTRUCTION_POINTER_LOW, 0)
      return instructionCode
    }

    const nextAddress = numberToWord(instructionIndex + 1)
    this.setRegister(Register.INSTRUCTION_POINTER_HIGH, nextAddress[0])
    this.setRegister(Register.INSTRUCTION_POINTER_LOW, nextAddress[1])

    const parameter = this.storage[instructionIndex * 2 + 1]
    this.executeInstruction(instructionCode, parameter)

    return instructionCode
  }

  incrementStackPointer (amount: number = 1) {
    this.registers[Register.STACK_INDEX] = (this.registers[Register.STACK_INDEX] + amount) % MEM_STACK_LEN
  }

  decrementStackPointer (amount: number = 1) {
    this.registers[Register.STACK_INDEX] = this.registers[Register.STACK_INDEX] - amount
    if (this.registers[Register.STACK_INDEX] < 0) this.registers[Register.STACK_INDEX] = MEM_STACK_LEN + this.registers[Register.STACK_INDEX]
  }

  pushToStack (value: number) {
    value = valueIsHigh(this.registers[Register.WRAP_VALUES])
      ? (value % 255)
      : clampByte(value)

    this.incrementStackPointer()
    this.memory[MEM_STACK_ADDR + this.registers[Register.STACK_INDEX]] = value
  }

  getFromStack (index?: number) {
    if (index === undefined) index = this.registers[Register.STACK_INDEX]
    else if (index < 0) index = this.registers[Register.STACK_INDEX] + index

    if (index < 0) index = 256 + index

    return this.memory[MEM_STACK_ADDR + index]
  }

  setRegister (index: number | Register, value: number) {
    const key = typeof index === 'number'
      ? Register[Object.keys(Register)[index] as keyof typeof Register]
      : index
    if (key === undefined) return

    value = valueIsHigh(this.registers[Register.WRAP_VALUES])
      ? (value % 255)
      : clampByte(value)

    this.registers[key as string] = value
  }

  getRegister (index: number | Register) {
    const key = typeof index === 'number'
      ? Register[Object.keys(Register)[index] as keyof typeof Register]
      : index
    if (key === undefined) return 0

    return this.registers[key as string]
  }

  getDataBuffer () {
    return this.getRegister(Register.DATA_BUFFER_A)
  }

  setDataBuffer (value: number) {
    this.setRegister(Register.DATA_BUFFER_A, value)
  }

  getCurrentOperationIndex () {
    return wordToNumber(
      this.getRegister(Register.INSTRUCTION_POINTER_HIGH),
      this.getRegister(Register.INSTRUCTION_POINTER_LOW)
    )
  }

  getCurrentMemoryIndex () {
    return wordToNumber(
      this.getRegister(Register.MEMORY_POINTER_HIGH),
      this.getRegister(Register.MEMORY_POINTER_LOW)
    )
  }

  readFromMemory (index: number, numBytes: number) {
    return this.memory.slice(index, index + numBytes)
  }

  writeToMemory (index: number, bytes: number[]) {
    for (let i = 0; i < bytes.length; i++) {
      if (this.memory[index + i] === undefined) return
      this.memory[index + i] = bytes[i]
    }
  }

  getCurrentStorageIndex () {
    return wordToNumber(
      this.getRegister(Register.STORAGE_POINTER_HIGH),
      this.getRegister(Register.STORAGE_POINTER_LOW)
    )
  }

  readFromStorage (index: number, numBytes: number) {
    return this.storage.slice(index, index + numBytes)
  }

  writeToStorage (index: number, bytes: number[]) {
    for (let i = 0; i < bytes.length; i++) {
      if (this.storage[index + i] === undefined) return
      this.storage[index + i] = bytes[i]
    }
  }

  jumpToAddress (address: Address) {
    this.setRegister(Register.INSTRUCTION_POINTER_HIGH, address[0])
    this.setRegister(Register.INSTRUCTION_POINTER_LOW, address[1])
  }

  jumpToLabel (label: number) {
    this.setRegister(Register.RETURN_POINTER_HIGH, this.getRegister(Register.INSTRUCTION_POINTER_HIGH))
    this.setRegister(Register.RETURN_POINTER_LOW, this.getRegister(Register.INSTRUCTION_POINTER_LOW))

    const address = this.program!.labels[label]
    this.jumpToAddress(address)
  }

  executeInstruction (instructionCode: number, parameter: number = 0) {
    const a = this.getFromStack();
    const b = this.getFromStack(-1);

    switch (instructionCode) {
      case InstructionCode.CONST: {
        this.decrementStackPointer()
        this.pushToStack(parameter)
        break
      }
      case InstructionCode.PUSH: {
        this.pushToStack(parameter)
        break
      }
      case InstructionCode.PUSHR: {
        this.pushToStack(this.getRegister(parameter))
        break
      }
      case InstructionCode.POP: {
        this.setDataBuffer(a)
        this.decrementStackPointer()
        break
      }
      case InstructionCode.COPY: {
        this.setDataBuffer(a)
        break
      }
      case InstructionCode.INCR: {
        this.incrementStackPointer(parameter)
        break
      }
      case InstructionCode.DECR: {
        this.decrementStackPointer(parameter)
        break
      }
      case InstructionCode.ADD: {
        this.pushToStack(b + a);
        break
      }
      case InstructionCode.SUB: {
        this.pushToStack(b - a);
        break
      }
      case InstructionCode.MUL: {
        this.pushToStack(b * a);
        break
      }
      case InstructionCode.DIV: {
        this.pushToStack(Math.round(b / a));
        break
      }
      case InstructionCode.MOD: {
        this.pushToStack(b % a);
        break
      }
      case InstructionCode.AND: {
        this.pushToStack(b & a);
        break
      }
      case InstructionCode.OR: {
        this.pushToStack(b | a);
        break
      }
      case InstructionCode.XOR: {
        this.pushToStack(b ^ a);
        break
      }
      case InstructionCode.NOT: {
        this.pushToStack(~a);
        break
      }
      case InstructionCode.LSHFT: {
        this.pushToStack(b << a);
        break
      }
      case InstructionCode.RSHFT: {
        this.pushToStack(b >> a);
        break
      }
      case InstructionCode.SET: {
        this.setDataBuffer(parameter)
        break
      }
      case InstructionCode.GET: {
        this.setDataBuffer(this.getRegister(parameter))
        break
      }
      case InstructionCode.MOV: {
        this.setRegister(parameter, this.getDataBuffer())
        break
      }
      case InstructionCode.MADDR: {
        this.setRegister(Register.MEMORY_POINTER_HIGH, b)
        this.setRegister(Register.MEMORY_POINTER_LOW, a)
        break
      }
      case InstructionCode.PEEK: {
        this.setDataBuffer(this.memory[this.getCurrentMemoryIndex()])
        break
      }
      case InstructionCode.POKE: {
        this.memory[this.getCurrentMemoryIndex()] = this.getDataBuffer()
        break
      }
      case InstructionCode.SAVE: {
        const rawSaveData = localStorage.getItem('__TamaGoSaveData')
        const saveData: { [key: string]: number[] } = (rawSaveData && JSON.parse(rawSaveData)) || {}

        saveData[this.program!.name] = this.readFromMemory(MEM_SAVE_DATA_ADDR, MEM_SAVE_DATA_LEN)
        localStorage.setItem('__TamaGoSaveData', JSON.stringify(saveData))

        break
      }
      case InstructionCode.LOAD: {
        const rawSaveData = localStorage.getItem('__TamaGoSaveData')
        const saveData: { [key: string]: number[] } = (rawSaveData && JSON.parse(rawSaveData)) || {}

        this.writeToMemory(MEM_SAVE_DATA_ADDR, saveData[this.program!.name] || [])

        break
      }
      case InstructionCode.SADDR: {
        this.setRegister(Register.STORAGE_POINTER_HIGH, b)
        this.setRegister(Register.STORAGE_POINTER_LOW, a)
        break
      }
      case InstructionCode.READ: {
        this.setDataBuffer(this.storage[this.getCurrentStorageIndex()])
        break
      }
      case InstructionCode.GOTO: {
        this.setRegister(Register.INSTRUCTION_POINTER_HIGH, b)
        this.setRegister(Register.INSTRUCTION_POINTER_LOW, a)
        break
      }
      case InstructionCode.JUMP: {
        this.jumpToLabel(parameter)
        break
      }
      case InstructionCode.RTN: {
        const address: Address = [this.getRegister(Register.RETURN_POINTER_HIGH), this.getRegister(Register.RETURN_POINTER_LOW)]
        this.jumpToAddress(address)
        break
      }
      case InstructionCode.JEQ: {
        if (b === a)  this.jumpToLabel(parameter)
        break
      }
      case InstructionCode.JNEQ: {
        if (b !== a)  this.jumpToLabel(parameter)
        break
      }
      case InstructionCode.JGT: {
        if (b > a)  this.jumpToLabel(parameter)
        break
      }
      case InstructionCode.JGTE: {
        if (b >= a)  this.jumpToLabel(parameter)
        break
      }
      case InstructionCode.JLT: {
        if (b < a)  this.jumpToLabel(parameter)
        break
      }
      case InstructionCode.JLTE: {
        if (b <= a)  this.jumpToLabel(parameter)
        break
      }
      case InstructionCode.BTN: {
        if (this.memory[MEM_BUTTON_ADDR + a] === 1) this.setDataBuffer(HIGH)
        else this.setDataBuffer(LOW)
        break
      }
      case InstructionCode.BTND: {
        if (this.memory[MEM_BUTTON_ADDR + a] === 1 || this.memory[MEM_BUTTON_ADDR + a] === 2) this.setDataBuffer(HIGH)
        else this.setDataBuffer(LOW)
        break
      }
      case InstructionCode.TICK: {
        this.setDataBuffer(this.memory[MEM_TIMER_ADDR])
        break
      }
      case InstructionCode.PIN: {
        this.setDataBuffer(this.memory[MEM_SERIAL_PIN_ADDR + parameter])
        break
      }
      case InstructionCode.POUT: {
        this.writeToMemory(MEM_SERIAL_PIN_ADDR + parameter, [this.getDataBuffer()])
        break
      }
      case InstructionCode.SEND: {
        this.writeToMemory(MEM_SERIAL_STATE_ADDR, [HIGH, LOW])
        break
      }
      case InstructionCode.RECV: {
        const state = this.readFromMemory(MEM_SERIAL_STATE_ADDR, 2)
        if (!valueIsHigh(state[0]) && valueIsHigh(state[1])) this.setDataBuffer(HIGH)
        else this.setDataBuffer(LOW)
        break
      }
      case InstructionCode.CLEAR: {
        const pixels = arrayOfLength(MEM_VIDEO_LEN)
        pixels.fill(parameter)
        this.writeToMemory(MEM_VIDEO_ADDR, pixels)
        break
      }
      case InstructionCode.DRAW: {
        const index = (b % DISPLAY_WIDTH) + (a * DISPLAY_WIDTH)
        this.writeToMemory(MEM_VIDEO_ADDR + index, [parameter % 4])
        break
      }
      case InstructionCode.SHADE: {
        const index = (b % DISPLAY_WIDTH) + (a * DISPLAY_WIDTH)
        this.setDataBuffer(this.memory[MEM_VIDEO_ADDR + index])
        break
      }
      case InstructionCode.TILE: {
        // TODO
        break
      }
      case InstructionCode.SPR: {
        // TODO
        break
      }
      case InstructionCode.ICON: {
        // TODO
        break
      }
      case InstructionCode.PRINT: {
        // TODO
        break
      }
      case InstructionCode.TONE: {
        this.writeToMemory(MEM_AUDIO_ADDR, [b, a])
        break
      }
      case InstructionCode.SLEEP: {
        this.setRegister(Register.SLEEP_COUNTER, parameter)
        break
      }
      case InstructionCode.LOGR: {
        console.log('REGISTER', this.getRegister(parameter))
        break
      }
      case InstructionCode.LOGS: {
        console.log('STACK', this.getFromStack())
        break
      }
      case InstructionCode.NOP: {
        break
      }
    }
  }
}
