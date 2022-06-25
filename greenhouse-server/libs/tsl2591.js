import i2cBus from 'i2c-bus';

'use strict';
const INI_PIN             = 4

const ADDR                = (0x29)

const COMMAND_BIT         = (0xA0)
//Register (0x00)
const ENABLE_REGISTER     = (0x00)
const ENABLE_POWERON      = (0x01)
const ENABLE_POWEROFF     = (0x00)
const ENABLE_AEN          = (0x02)
const ENABLE_AIEN         = (0x10)
const ENABLE_SAI          = (0x40)
const ENABLE_NPIEN        = (0x80)

const CONTROL_REGISTER    = (0x01)
const SRESET              = (0x80)
//AGAIN
const LOW_AGAIN           = (0X00)//Low gain (1x)
const MEDIUM_AGAIN        = (0X10)//Medium gain (25x)
const HIGH_AGAIN          = (0X20)//High gain (428x)
const MAX_AGAIN           = (0x30)//Max gain (9876x)
//ATIME
const ATIME_100MS         = (0x00)//100 millis //MAX COUNT 36863 
const ATIME_200MS         = (0x01)//200 millis //MAX COUNT 65535 
const ATIME_300MS         = (0x02)//300 millis //MAX COUNT 65535 
const ATIME_400MS         = (0x03)//400 millis //MAX COUNT 65535 
const ATIME_500MS         = (0x04)//500 millis //MAX COUNT 65535 
const ATIME_600MS         = (0x05)//600 millis //MAX COUNT 65535 

const AILTL_REGISTER      = (0x04)
const AILTH_REGISTER      = (0x05)
const AIHTL_REGISTER      = (0x06)
const AIHTH_REGISTER      = (0x07)
const NPAILTL_REGISTER    = (0x08)
const NPAILTH_REGISTER    = (0x09)
const NPAIHTL_REGISTER    = (0x0A)
const NPAIHTH_REGISTER    = (0x0B)

const PERSIST_REGISTER    = (0x0C)
// Bits 3:0
// 0000          Every ALS cycle generates an interrupt
// 0001          Any value outside of threshold range
// 0010          2 consecutive values out of range
// 0011          3 consecutive values out of range
// 0100          5 consecutive values out of range
// 0101          10 consecutive values out of range
// 0110          15 consecutive values out of range
// 0111          20 consecutive values out of range
// 1000          25 consecutive values out of range
// 1001          30 consecutive values out of range
// 1010          35 consecutive values out of range
// 1011          40 consecutive values out of range
// 1100          45 consecutive values out of range
// 1101          50 consecutive values out of range
// 1110          55 consecutive values out of range
// 1111          60 consecutive values out of range

const ID_REGISTER         = (0x12)

const STATUS_REGISTER     = (0x13)//read only

const CHAN0_LOW           = (0x14)
const CHAN0_HIGH          = (0x15)
const CHAN1_LOW           = (0x16)
const CHAN1_HIGH          = (0x14)

//LUX_DF = GA * 53   GA is the Glass Attenuation factor 
const LUX_DF              = 762.0
// LUX_DF              = 408.0
const MAX_COUNT_100MS     = (36863) // 0x8FFF
const MAX_COUNT           = (65535) // 0xFFFF

const sleep = ms => new Promise(r => setTimeout(r, ms));

export default class TSL2591 {
    constructor(options) {
        this.i2c = i2cBus;

        this.i2cBusNo = (options && options.hasOwnProperty('i2cBusNo')) ? options.i2cBusNo : 1;    
        this.i2cBus = this.i2c.openSync(this.i2cBusNo);
        this.i2cAddress = (options && options.hasOwnProperty('i2cAddress')) ? options.i2cAddress : ADDR;
        this.address = this.i2cAddress;
        // GPIO.setmode(GPIO.BCM)
        // GPIO.setwarnings(False)
        // GPIO.setup(INI_PIN, GPIO.IN)
        
        this.ID = this.Read_Byte(ID_REGISTER)
        if(this.ID != 0x50) {
            console.log(`ID = ${this.ID}`);
            //sys.exit()
        }
        this.Enable()
        this.Set_Gain(MEDIUM_AGAIN)
        this.Set_IntegralTime(ATIME_100MS)
        this.Write_Byte(PERSIST_REGISTER, 0x01)
        this.Disable()
    }

    Read_Byte(addr) {
        addr = (COMMAND_BIT | addr) & 0xFF;
        return this.i2cBus.readByteSync(this.address, addr);
    }
    Read_Word(addr) {
        addr = (COMMAND_BIT | addr) & 0xFF;
        return this.i2cBus.readWordSync(this.address, addr);
    }
    Write_Byte(addr, val) {
        addr = (COMMAND_BIT | addr) & 0xFF;
        this.i2cBus.writeByteSync(this.address, addr, val & 0xFF);
    }
    Enable() {
        this.Write_Byte(ENABLE_REGISTER, ENABLE_AIEN | ENABLE_POWERON | ENABLE_AEN | ENABLE_NPIEN);
    }
    Disable() {
        this.Write_Byte(ENABLE_REGISTER, ENABLE_POWEROFF);
    }
    Get_Gain() {
        const data = this.Read_Byte(CONTROL_REGISTER);
        return data & 0b00110000;
    }
    Set_Gain(val) {
        if(val == LOW_AGAIN || val == MEDIUM_AGAIN ||val == HIGH_AGAIN || val == MAX_AGAIN) {
            let control = this.Read_Byte(CONTROL_REGISTER);
            control &= 0b11001111;
            control |= val;
            this.Write_Byte(CONTROL_REGISTER, control);
            this.Gain = val;
        }
        else {
            console.log("Gain Parameter Error");
        }
    }

    Get_IntegralTime() {
        control = this.Read_Byte(CONTROL_REGISTER);
        return control & 0b00000111;
    }
    Set_IntegralTime(val) {
        if((val & 0x07) < 96) {
            let control = this.Read_Byte(CONTROL_REGISTER);
            control &= 0b11111000;
            control |= val;
            this.Write_Byte(CONTROL_REGISTER, control);
            this.IntegralTime = val;
        }
        else {
            console.log("Integral Time Parameter Error")
        }
    }
    Read_CHAN0() {
        return this.Read_Word(CHAN0_LOW);
    }
    
    Read_CHAN1() {
        return this.Read_Word(CHAN1_LOW);
    }
    
    // @property
    // def Read_FullSpectrum(self):
    //     """Read the full spectrum (IR + visible) light and return its value"""
    //     self.Enable()
    //     # for i in range(0, self.IntegralTime+2):
    //         # time.sleep(0.1)
    //     data = (self.Read_CHAN1()  << 16) | self.Read_CHAN0()
    //     self.Disable()
    //     return data
    // @property   
    // def Read_Infrared(self):
    //     '''Read the infrared light and return its value as a 16-bit unsigned number'''
    //     self.Enable()
    //     # for i in range(0, self.IntegralTime+2):
    //         # time.sleep(0.1)
    //     data = self.Read_CHAN0()
    //     self.Disable()
    //     return data
    
    // @property
    // def Read_Visible(self):#Visible light
    //     self.Enable()
    //     # for i in range(0, self.IntegralTime+2):
    //         # time.sleep(0.1)
    //     Ch1 = self.Read_CHAN1()
    //     Ch0 = self.Read_CHAN0()
    //     self.Disable()
    //     full = (Ch1 << 16) | Ch0
    //     return full - Ch1
    
     async getLux() {
        this.Enable()
        for(let i = 0; i < this.IntegralTime*2; i++) {
            await sleep(100);
        }
        // if(GPIO.input(INI_PIN) == GPIO.HIGH):
        //     print ('INT 0')
        // else:
        //     print ('INT 1')
        let channel_0 = this.Read_CHAN0()
        let channel_1 = this.Read_CHAN1()
        //this.Disable()

        // this.Enable()
        // this.Write_Byte(0xE7, 0x13) //Clear interrupt flag
        //this.Disable()

        const atime = 100.0 * this.IntegralTime + 100.0
        
        //Set the maximum sensor counts based on the integration time (atime) setting
        const max_counts = (this.IntegralTime == ATIME_100MS) ? MAX_COUNT_100MS : MAX_COUNT;

        if (channel_0 >= max_counts || channel_1 >= max_counts) {
            let gain_t = this.Get_Gain();
            if(gain_t != LOW_AGAIN) {
                gain_t = ((gain_t>>4)-1)<<4;
                this.Set_Gain(gain_t);
                channel_0 = 0;
                channel_1 = 0;
                while(channel_0 <= 0 && channel_1 <=0) {
                    channel_0 = this.Read_CHAN0()
                    channel_1 = this.Read_CHAN1()
                    await sleep(100)
                }
            }
            else {
                //raise RuntimeError('Numerical overflow!')
            }
        }
        let again = 1.0;
        if (this.Gain == MEDIUM_AGAIN) {
            again = 25.0;
        } else if (this.Gain == HIGH_AGAIN) {
            again = 428.0;
        } else if (this.Gain == MAX_AGAIN) {
            again = 9876.0;
        }
        
        const Cpl = (atime * again) / LUX_DF;
        const lux1 = (channel_0 - (2 * channel_1)) / Cpl;
        // lux2 = ((0.6 * channel_0) - (channel_1)) / Cpl
        // This is a two segment lux equation where the first 
        // segment (Lux1) covers fluorescent and incandescent light 
        // and the second segment (Lux2) covers dimmed incandescent light
        
        return Math.max(lux1, 0);
    }
    // def SET_InterruptThreshold(self, HIGH, LOW):
    //     self.Enable()
    //     self.Write_Byte(AILTL_REGISTER, LOW & 0xFF)
    //     self.Write_Byte(AILTH_REGISTER, LOW >> 8)
        
    //     self.Write_Byte(AIHTL_REGISTER, HIGH & 0xFF)
    //     self.Write_Byte(AIHTH_REGISTER, HIGH >> 8)
        
    //     self.Write_Byte(NPAILTL_REGISTER, 0 )
    //     self.Write_Byte(NPAILTH_REGISTER, 0 )
        
    //     self.Write_Byte(NPAIHTL_REGISTER, 0xff )
    //     self.Write_Byte(NPAIHTH_REGISTER, 0xff )
    //     self.Disable()
        
    // def TSL2591_SET_LuxInterrupt(self, SET_LOW, SET_HIGH):
    //     atime  = 100 * self.IntegralTime + 100
    //     again = 1.0;
    //     if(self.Gain == MEDIUM_AGAIN):
    //         again = 25.0;
    //     elif(self.Gain == HIGH_AGAIN):
    //         again = 428.0
    //     elif(self.Gain == MAX_AGAIN):
    //         again = 9876.0;
    //     Cpl = (atime * again) / LUX_DF
    //     channel_1 = self.Read_CHAN1()
        
    //     SET_HIGH =  (int)(Cpl * SET_HIGH)+ 2*channel_1-1
    //     SET_LOW = (int)(Cpl * SET_LOW)+ 2*channel_1+1
        
    //     self.Enable()
    //     self.Write_Byte(AILTL_REGISTER, SET_LOW & 0xFF)
    //     self.Write_Byte(AILTH_REGISTER, SET_LOW >> 8)
        
    //     self.Write_Byte(AIHTL_REGISTER, SET_HIGH & 0xFF)
    //     self.Write_Byte(AIHTH_REGISTER, SET_HIGH >> 8)
        
    //     self.Write_Byte(NPAILTL_REGISTER, 0 )
    //     self.Write_Byte(NPAILTH_REGISTER, 0 )
        
    //     self.Write_Byte(NPAIHTL_REGISTER, 0xff )
    //     self.Write_Byte(NPAIHTH_REGISTER, 0xff )
    //     self.Disable()
}