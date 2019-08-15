import {
    Entity, PrimaryGeneratedColumn, Column, OneToMany,
} from 'typeorm';
import { Title } from '@tsed/swagger';
import { SetEffect } from './SetEffect';
import { Equip } from './Equip';

@Entity()
export class EquipSet {
    @PrimaryGeneratedColumn()
    @Title('ID')
    public id: number;

    @Column()
    @Title('套装名称')
    public name: string;

    @OneToMany(() => SetEffect, setEffect => setEffect.set)
    @Title('套装特效')
    public setEffect: SetEffect[];

    @OneToMany(() => Equip, equip => equip.set)
    public equip: Equip[];
}
