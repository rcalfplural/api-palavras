import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { v4 } from "uuid";

@Entity("users")
class User{
    @PrimaryColumn()
    readonly id: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({ name: "profile_picture" })
    profilePicture: string;

    @Column({ name: "is_admin" })
    isAdmin: boolean;

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

export { User };