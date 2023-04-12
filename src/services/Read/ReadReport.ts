/** Once dataset parse this class can read the raw datas and register them in the database if they aren't yet */
export class ReadReport {
    /**
     * 
     * @param data - parsed raw datas
     */
    constructor(public data: Object){}

    createActor(){

    }

    createReport(){

    }

    createAgendaItems(){

    }

    createSpeeches(){
    }

    Read(){
        console.log(this.data);
        // check if report exist and agenda item (because all of them a related)
            //if not create him
        // if yes, pass


        // check if speech exist 
            // if not exist, create him
                //check if actor exist
                    //if not create him
                    // else, next
        
        
        // return array with new entry
        
    }
}