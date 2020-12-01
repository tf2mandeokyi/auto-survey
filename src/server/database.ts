import mysql, { Connection, ConnectionConfig } from 'mysql';
import * as jsonreader from '../json/jsonreader';



export interface SurveyUser {
    birthday: string;
    name: string;
    province: string;
    schoolType: string;
    school: string;
}



export class DatabaseConnector {
    private connectionOptions : ConnectionConfig;
    private connection : Connection;

    constructor(connectionOptions: ConnectionConfig) {
        this.connectionOptions = connectionOptions;
    }

    async connect() {
        return new Promise<void>((res, rej) => {
            this.connection = mysql.createConnection(this.connectionOptions);
            this.connection.connect(error => {
                if(error) rej(error);
                res();
            })
        })
    }

    async setupDatabase() {
        console.log('Setting database up...');
        this.connection.query('CREATE DATABASE IF NOT EXISTS `auto_survey`');
        console.log('Setting table up...');
        this.connection.query(
            'CREATE TABLE IF NOT EXISTS `auto_survey`.`students_info` (' +
                '`birthday` VARCHAR(6) NOT NULL,' +
                '`name` VARCHAR(32) NOT NULL,' +
                '`province` VARCHAR(32) NOT NULL,' +
                '`schoolType` VARCHAR(32) NOT NULL,' +
                '`school` VARCHAR(32) NOT NULL' +
            `) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;`
        )
    }
}