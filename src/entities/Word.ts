import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { v4 } from "uuid";

@Entity("words")
class Word {
    @PrimaryColumn()
    readonly id: string;

    @Column()
    word: string;

    @Column()
    is_palindrom: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    constructor(){
        if(!this.id){
            this.id = v4();
        }
    }
}

export { Word };
