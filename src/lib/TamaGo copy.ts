/*
 * Constants
 */

export const CPU_FREQUENCY    = 64000 // Hz
export const MEM_TOTAL_LEN    = 640
export const MEM_STACK_ADDR   = 0
export const MEM_STACK_LEN    = 32
export const MEM_VIDEO_ADDR   = 32
export const MEM_VIDEO_LEN    = 128
export const MEM_LABEL_ADDR   = 160
export const MEM_LABEL_LEN    = 128
export const MEM_ICON_ADDR    = 288
export const MEM_BTN_ADDR     = 292
export const MEM_AUDIO_ADDR   = 296
export const MEM_CLOCK_ADDR   = 300
export const STORE_TOTAL_LEN  = 65535


/*
 * Enumerators
 */

export enum Instruction {
  // Stack operations
  CONST   = 'const',   // push the parameter to the stack
  PUSH    = 'push',    // push the value of the memory buffer onto the stack
  POP     = 'pop',     // pop the last value off the stack onto the memory buffer
  GET     = 'get',     // copy the value of the stack at the index of the last item on the stack, or passed in parameter, onto the memory buffer
  INDEX   = 'index',   // copy the current index in the stack counterr to the memory buffer
  MOV     = 'mov',     // copy the last value of the stack to the memory buffer

  // Arthimetic operations
  ADD     = 'add',     // add the last two values of the stack, and push the result to the stack
  SUB     = 'sub',     // subtract the last two values of the stack, and push the result to the stack
  MUL     = 'mul',     // multiply the last two values of the stack, and push the result to the stack
  DIV     = 'div',     // divide the last two values of the stack, and push the rounded result to the stack
  MOD     = 'mod',     // push the remainder/modulo of the last two values onto the stack

  // Bitwise operations
  AND     = 'and',     // AND the last two values of the stack, and push the result to the stack
  OR      = 'or',      // OR the last two values of the stack, and push the result to the stack
  XOR     = 'xor',     // XOR the last two values of the stack, and push the result to the stack
  NOT     = 'not',     // NOT the last value of the stack, and push the result to the stack
  LSHIFT  = 'lshift',  // shift the second last value by the amount of the last value to the left, and push the result to the stack
  RSHIFT  = 'rshift',  // shift the second last value by the amount of the last value to the right, and push the result to the stack

  // Memory operations
  PEEK    = 'peek',    // copy the value of the current memory address to the memory buffer
  POKE    = 'poke',    // copy the value of memory buffer to the current memory address
  ADDR    = 'addr',    // set the current memory address to the last two values of the stack

  // Storage operations
  READ    = 'read',    // copy the value of current store address to the memory buffer
  WRITE   = 'write',   // copy the value of memory buffer to the current store address
  STORE   = 'store',   // set the current store address to the last two values of the stack

  // Display operations
  CLEAR   = 'clear',   // clears the display for redrawing with the shade of the last value in the stack, or the specified parameter
  DRAW    = 'draw',    // set the shade of a pixel in the display; the last two values of the stack are the index and shade
  PIXEL   = 'pixel',   // copy the shade of the pixel as specified by the last two values on the stack to the memory buffer
  ICON    = 'icon',    // activates/deactivates an icon; the last two values of the stack are the index and the state

  // Audio operations
  TONE    = 'tone',    // play a tone; the last two values of the stack are the frequency, a value of 0 will play no audio (or a parameter with value 0)

  // Input operations
  BTN     = 'btn',     // pushes a high value to the memory buffer if a button was pressed; button specified by the parameter, or last value in the stack
  BTND    = 'btnd',    // pushes a high value to the memory buffer if a button is down; button specified by the parameter, or last value in the stack
  CLOCK   = 'clock',   // pushes the modulo of the current clock value by 256 to the memory buffer

  // Jump and conditional operations
  COMP    = 'comp',    // compare two values in the stack to each other, store the result in the comparison register
  LABEL   = 'label',   // copy the last two values in the stack to memory, to reference with jump later
  JUMP    = 'jump',    // sets the program counter to the storage address of the label specified by the last item in the stack, or parameter if specified
  JEQ     = 'jeq',     // only jump if last comparison was equal (1)
  JNEQ    = 'jneq',    // only jump if last comparison was not equal (2)
  JGT     = 'jgt',     // only jump if last comparison was greater than (3)
  JGTE    = 'jgte',    // only jump if last comparison was greater than or equal (4)
  JLT     = 'jlt',     // only jump if last comparison was less than (5)
  JLTE    = 'jlte',    // only jump if last comparison was less than or equal (6)
  GOTO    = 'goto',    // sets the program counter to the storage address of the last two items in the stack
  BREAK   = 'break',   // sets the program counter to the storage address of the previous jump, a high value in the last item of the stack, or a high value in the parameter, prevents the jump from being executed again

  // Misc. operations
  SLEEP   = 'sleep',   // sleep for as many cycles as specified by the last value in the stack
  PRINT   = 'print',   // print the last value on the stack to the JavaScript console
  NOP     = 'nop'      // no operation; does nothing
}

export const InstructionCode: Instruction[] = Object
  .keys(Instruction)
  .map((key) => (Instruction as any)[key])

export const InstructionCodeMap: { [key: number]: Instruction } = Object
  .keys(Instruction)
  .reduce<{ [key: number]: Instruction }>((acc, key, i) => (acc[i] = (Instruction as any)[key], acc), {})


/*
 * Types
 */

export type MemoryAddress = [
  number,
  number
]


/*
 * Class
 */

export default class TamaGo {
  // State
  running: boolean = false

  // Icons
  icons: string[] = []

  // Background cutout
  cutout: ImageData | undefined

  // 640 bytes of RAM
  memory: Uint8ClampedArray = new Uint8ClampedArray(640)

  // 655 360 bytes of flash
  storage: Uint8ClampedArray = new Uint8ClampedArray(655360)

  // Registers
  regProgramCounter:    number = 0
  regMemoryAccess:      number = 0
  regStorageAccess:     number = 0
  regLastJumpOrigin:    number = 0
  regMemoryBuffer:      number = 0
  regStackCounter:      number = 0
  regSleepForCycles:    number = 0
  regComparisonValueA:  number = 0
  regComparisonValueB:  number = 0

  constructor () {
    this.reset()
  }

  static addressToIndex (byte0: number, byte1: number) {
    return (byte0 << 8) | (byte1 & 0xff)
  }

  static indexToAddress (index: number) {
    return [
      (index >> 0) & 0xff,
      (index >> 8) & 0xff
    ] as MemoryAddress
  }

  static numberToBinary (number: number) {
    let binary = number.toString(2)
    while (binary.length < 7) {
      binary = '0' + binary
    }
    return binary
  }

  static getBinaryBits (binary: string, radix: number) {
    const bits = []
    for (let i = 0; i < binary.length; i += radix) {
      bits.push(parseInt(binary.substring(i, radix)))
    }
    return bits
  }

  reset () {
    this.memory.fill(0)
    this.storage.fill(0)
  }

  run () {

  }

  pause () {

  }

  cycle () {

  }

  pushToStack (value: number) {
    this.memory[MEM_STACK_ADDR + this.regStackCounter] = value
    this.regStackCounter = (this.regStackCounter + 1) % MEM_STACK_LEN
  }

  getFromStack (index?: number) {
    if (index === undefined) index = this.regStackCounter
    return this.memory[MEM_STACK_ADDR + index]
  }

  jumpToLabel (index: number) {
    index = MEM_LABEL_ADDR + (index % (MEM_LABEL_LEN / 2))
    this.regLastJumpOrigin = this.regProgramCounter
    this.regProgramCounter = TamaGo.addressToIndex(this.memory[index], this.memory[index + 1])
  }

  executeInstruction (instructionCode: number, parameter: number = 0) {
    switch (InstructionCode[instructionCode] as Instruction) {
      case Instruction.CONST: {
        this.pushToStack(parameter)
        break
      }
      case Instruction.PUSH: {
        this.pushToStack(this.regMemoryBuffer)
        break
      }
      case Instruction.POP: {
        this.regMemoryBuffer = this.getFromStack()
        this.regStackCounter--
        if (this.regStackCounter < 0) this.regStackCounter = 0
        break
      }
      case Instruction.GET: {
        this.regMemoryBuffer = this.regStackCounter
        break
      }
      case Instruction.INDEX: {
        this.regMemoryBuffer = this.getFromStack(this.getFromStack())
        break
      }
      case Instruction.MOV: {
        this.regMemoryBuffer = this.getFromStack()
        break
      }
      case Instruction.ADD: {
        const a = this.getFromStack(-1)
        const b = this.getFromStack()
        this.pushToStack(a + b)
        break
      }
      case Instruction.SUB: {
        const a = this.getFromStack(-1)
        const b = this.getFromStack()
        this.pushToStack(a - b)
        break
      }
      case Instruction.MUL: {
        const a = this.getFromStack(-1)
        const b = this.getFromStack()
        this.pushToStack(a * b)
        break
      }
      case Instruction.DIV: {
        const a = this.getFromStack(-1)
        const b = this.getFromStack()
        this.pushToStack(Math.round(a / b))
        break
      }
      case Instruction.MOD: {
        const a = this.getFromStack(-1)
        const b = this.getFromStack()
        this.pushToStack(a % b)
        break
      }
      case Instruction.AND: {
        const a = this.getFromStack(-1)
        const b = this.getFromStack()
        this.pushToStack(a & b)
        break
      }
      case Instruction.OR: {
        const a = this.getFromStack(-1)
        const b = this.getFromStack()
        this.pushToStack(a | b)
        break
      }
      case Instruction.XOR: {
        const a = this.getFromStack(-1)
        const b = this.getFromStack()
        this.pushToStack(a ^ b)
        break
      }
      case Instruction.NOT: {
        const a = this.getFromStack(-1)
        this.pushToStack(~a)
        break
      }
      case Instruction.LSHIFT: {
        const a = this.getFromStack(-1)
        const b = this.getFromStack()
        this.pushToStack(a << b)
        break
      }
      case Instruction.RSHIFT: {
        const a = this.getFromStack(-1)
        const b = this.getFromStack()
        this.pushToStack(a >> b)
        break
      }
      case Instruction.PEEK: {
        this.regMemoryBuffer = this.memory[this.regMemoryAccess]
        break
      }
      case Instruction.POKE: {
        this.memory[this.regMemoryAccess] = this.regMemoryBuffer
        break
      }
      case Instruction.ADDR: {
        const a = this.getFromStack(-1)
        const b = this.getFromStack()
        this.regMemoryAccess = TamaGo.addressToIndex(a, b) % MEM_TOTAL_LEN
        break
      }
      case Instruction.READ: {
        this.regMemoryBuffer = this.storage[this.regStorageAccess]
        break
      }
      case Instruction.WRITE: {
        this.storage[this.regStorageAccess] = this.regMemoryBuffer
        break
      }
      case Instruction.STORE: {
        const a = this.getFromStack(-1)
        const b = this.getFromStack()
        this.regStorageAccess = TamaGo.addressToIndex(a, b) % STORE_TOTAL_LEN
        break
      }
      case Instruction.CLEAR: {
        const shade = this.getFromStack()

        for (let i = 0; i < MEM_VIDEO_LEN; i++) {
          this.memory[MEM_VIDEO_ADDR + i] = (
            (shade << 2) |
            (shade << 4) |
            (shade << 6) |
            (shade & 0xff)
          )
        }

        break
      }
      case Instruction.DRAW: {
        const x = this.getFromStack(-2)
        const y = this.getFromStack(-1)
        const shade = this.getFromStack()

        const index = (x + y * 16) % MEM_VIDEO_LEN
        const byte = this.memory[MEM_VIDEO_ADDR + Math.floor(index / 4)]
        const bits = TamaGo.getBinaryBits(TamaGo.numberToBinary(byte), 2)

        bits[index % 4] = shade
        this.memory[MEM_VIDEO_ADDR + Math.floor(index / 4)] = (
          (bits[3] << 2) |
          (bits[2] << 4) |
          (bits[1] << 6) |
          (bits[0] & 0xff)
        )

        break
      }
      case Instruction.PIXEL: {
        const x = this.getFromStack(-1)
        const y = this.getFromStack()

        const index = (x + y * 16) % MEM_VIDEO_LEN
        const byte = this.memory[MEM_VIDEO_ADDR + Math.floor(index / 4)]
        const bits = TamaGo.getBinaryBits(TamaGo.numberToBinary(byte), 2)

        this.regMemoryBuffer = bits[index % 4]

        break
      }
      case Instruction.ICON: {
        const index = this.getFromStack(-1)
        const state = this.getFromStack()

        const byte = this.memory[MEM_ICON_ADDR]
        const bits = TamaGo.getBinaryBits(TamaGo.numberToBinary(byte), 1)

        bits[index] = (state === 0) ? 0 : 1
      
        this.memory[MEM_ICON_ADDR] = (
          (bits[7] << 1) |
          (bits[6] << 2) |
          (bits[5] << 3) |
          (bits[4] << 4) |
          (bits[3] << 5) |
          (bits[2] << 6) |
          (bits[1] << 7) |
          (bits[0] & 0xff)
        )

        break
      }
      case Instruction.TONE: {
        const a = this.getFromStack(-1)
        this.memory[MEM_AUDIO_ADDR] = a

        const b = this.getFromStack()
        this.memory[MEM_AUDIO_ADDR + 1] = b

        break
      }
      case Instruction.BTN: {
        const button = parameter % 2
        if (this.memory[MEM_BTN_ADDR + button] === 1) this.regMemoryBuffer = 1
        else this.regMemoryBuffer = 0
        break
      }
      case Instruction.BTND: {
        const button = parameter % 2
        if (this.memory[MEM_BTN_ADDR + button] > 0) this.regMemoryBuffer = 1
        else this.regMemoryBuffer = 0
        break
      }
      case Instruction.CLOCK: {
        this.regMemoryBuffer = this.memory[MEM_CLOCK_ADDR]
        break
      }
      case Instruction.COMP: {
        const a = this.getFromStack(-1)
        this.regComparisonValueA = a

        const b = this.getFromStack()
        this.regComparisonValueB = b

        break
      }
      case Instruction.LABEL: {
        const index = MEM_LABEL_ADDR + (parameter % (MEM_LABEL_LEN / 2))

        const a = this.getFromStack(-1)
        this.memory[index] = a

        const b = this.getFromStack()
        this.memory[index + 1] = b

        break
      }
      case Instruction.JUMP: {
        this.jumpToLabel(parameter)
        break
      }
      case Instruction.JEQ: {
        const a = this.regComparisonValueA
        const b = this.regComparisonValueB
        if (a === b) this.jumpToLabel(parameter)
        break
      }
      case Instruction.JNEQ: {
        const a = this.regComparisonValueA
        const b = this.regComparisonValueB
        if (a !== b) this.jumpToLabel(parameter)
        break
      }
      case Instruction.JGT: {
        const a = this.regComparisonValueA
        const b = this.regComparisonValueB
        if (a > b) this.jumpToLabel(parameter)
        break
      }
      case Instruction.JGTE: {
        const a = this.regComparisonValueA
        const b = this.regComparisonValueB
        if (a >= b) this.jumpToLabel(parameter)
        break
      }
      case Instruction.JLT: {
        const a = this.regComparisonValueA
        const b = this.regComparisonValueB
        if (a < b) this.jumpToLabel(parameter)
        break
      }
      case Instruction.JLTE: {
        const a = this.regComparisonValueA
        const b = this.regComparisonValueB
        if (a <= b) this.jumpToLabel(parameter)
        break
      }
      case Instruction.GOTO: {
        const a = this.getFromStack(-1)
        const b = this.getFromStack()
        this.regLastJumpOrigin = this.regProgramCounter
        this.regProgramCounter = TamaGo.addressToIndex(a, b)
        break
      }
      case Instruction.BREAK: {
        this.regProgramCounter = this.regLastJumpOrigin
        break
      }
      case Instruction.SLEEP: {
        this.regSleepForCycles = this.getFromStack()
        break
      }
      case Instruction.NOP: {
        break
      }
    }
  }

  loadProgram (program: string) {

  }

  setCutout (data: ImageData) {

  }
}
