import { observable } from "mobx";
import { Chip } from "../Chip";
import { ChipType, chipTypeInfo } from '../ChipType';
import { Pos } from "../common/Pos";
import { Pin } from "../Pin";

export class BUSChip extends Chip{
    @observable
    accessor pinState: Pin
    constructor(
        id: number,
        pos: Pos,
        type = 1){
            super(chipTypeInfo[ChipType.BUS].title!, ChipType.BUS, chipTypeInfo[ChipType.BUS].color!, id, pos);
            this.pinState = new Pin(-1,"STATE", type)
        }

    addInputPin = (pin:Pin)=>{
        this.pinState.linkNewPin(pin);
    }
    remInputPin = (pin:Pin)=>{
        // TODO: Remove pin when deleting wire
    }
    
}