import { Injectable } from '@angular/core';
@Injectable()
export class ToolbarService{
    private autoCompleteOptions: Array<string> = [];

    getAutoCompleteOptions():Array<string>{
        return this.autoCompleteOptions;
    }

    setAutoCompleteOptions(options: Array<string>){
        this.autoCompleteOptions = options;
    }

    addOptions(option: string): Array<string>{
        if(this.autoCompleteOptions.indexOf(option) == -1) this.autoCompleteOptions.push(option);
        return this.autoCompleteOptions;
    }
}
