import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddWordClassColumn1643653976211 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("words", 
            new TableColumn({
                name: "class",
                type: "varchar",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("words", "class");
    }


}
