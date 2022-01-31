import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm";
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

    @Column()
    use_rate: number;

    @Column()
    anagram_number: number;

    @Column()
    length: number;

    @ManyToMany(()=>Word)
    @JoinTable()
    anagram_of: Word[]

    constructor(){
        if(!this.id){
            this.id = v4();
        }
    }
}

export { Word };
