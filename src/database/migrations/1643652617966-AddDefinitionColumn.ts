import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddDefinitionColumn1643652617966 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("words", 
            new TableColumn({
                name: "definition",
                type: "varchar",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("words", "definition");
    }

}
