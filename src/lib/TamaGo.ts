/*
 * Constants
 */

export const CPU_FREQUENCY = 64000 // Hz


/*
 * Enumerators
 */

export enum Instruction {
  // Stack operations
  CONST   = 'const',   // push the parameter to the stack
  PUSH    = 'push',    // push the value of the memory buffer onto the stack
  POP     = 'pop',     // pop the last value off the stack onto the memory buffer
  INDEX   = 'index',   // copy the value of the stack at the index of the last item on the stack, or passed in parameter, onto the memory buffer
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
  RESET   = 'reset',   // sets the reset byte in memory to high, causing the console to reboot next cycle
  SLEEP   = 'sleep',   // sleep for as many cycles as specified by the last value in the stack
  NOP     = 'nop'      // no operation; does nothing
}


/*
 * Types
 */

export type Token = {
  instruction: Instruction,
  parameter: number | string
}

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
  regProgramCounter:    MemoryAddress = [0, 0]
  regMemoryBuffer:      number = 0
  regMemoryAccess:      MemoryAddress = [0, 0]
  regStorageAccess:     MemoryAddress = [0, 0]
  regLastJumpOrigin:    MemoryAddress = [0, 0]
  regStackCounter:      number = 0
  regSleepForCycles:    number = 0
  regComparisonResult:  number = 0

  constructor () {
    this.reset()
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

  decodeInstruction (address: MemoryAddress) {

  }

  loadProgram (program: string) {

  }

  setCutout (data: ImageData) {

  }
}
