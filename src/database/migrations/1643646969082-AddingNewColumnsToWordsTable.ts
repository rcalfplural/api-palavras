import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddingNewColumnsToWordsTable1643646969082 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("words", [
            new TableColumn({
                name: "use_rate",
                type: "integer",
                isNullable: true
            }),
            new TableColumn({
                name: "anagram_number",
                type: "integer",
                isNullable: true
            }),
            new TableColumn({
                name: "length",
                type: "integer",
                isNullable: true
            }),
            new TableColumn({
                name: "anagram_of",
                type: "uuid",
                isNullable: true
            })
        ]);
        await queryRunner.createForeignKeys("words", [
            new TableForeignKey({
                name: "FKAnagramOfWord",
                columnNames: ["anagram_of"],
                referencedColumnNames: ["id"],
                referencedTableName: "words"
            })
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns("words", [ "anagram_of", "length", "anagram_number", "use_rate" ]);
        await queryRunner.dropForeignKey("word", "FKAnagramOfWord");
    }

}
