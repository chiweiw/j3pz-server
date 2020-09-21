import { Service, AfterRoutesInit } from '@tsed/common';
import { TypeORMService } from '@tsed/typeorm';
import {
    Connection, Between, In, Like, FindConditions,
} from 'typeorm';
import { Equip } from '../entities/resources/Equip';
import { AttributeTag, Category, KungFu } from '../model/Base';
import { EquipCore } from '../model/Equip';
import { kungFuLib } from '../utils/KungFuLib';
import { KungFuMeta } from '../utils/KungfuMeta';

interface EquipListFilter {
    kungfu: KungFu;
    category: Category;
    quality: [number, number];
    name?: string;
    tag?: AttributeTag[];
}

@Service()
export class EquipService implements AfterRoutesInit {
    private connection: Connection;

    public constructor(private typeORMService: TypeORMService) {
        // nothing
    }

    public $afterRoutesInit(): void {
        this.connection = this.typeORMService.get('resources');
    }

    private getFilterByKungfu(kungfu: KungFu): Partial<KungFuMeta> {
        const { school, primaryAttribute } = kungFuLib[kungfu];
        return { school, primaryAttribute };
    }

    public async find(filter: EquipListFilter): Promise<EquipCore[]> {
        const kungfuFilter = this.getFilterByKungfu(filter.kungfu);
        const whereCondition: FindConditions<Equip> = {
            quality: Between(filter.quality[0], filter.quality[1]),
            category: filter.category,
            deprecated: false,
        };
        if (filter.name) {
            whereCondition.name = Like(`%${filter.name}%`);
        } else {
            whereCondition.school = In([kungfuFilter.school, '通用', '精简']);
            whereCondition.primaryAttribute = In([kungfuFilter.primaryAttribute, 'magic']);
        }
        const equips = await this.connection.manager.find(Equip, {
            select: ['id', 'icon', 'name', 'quality', 'category', ...AttributeTag],
            where: whereCondition,
            order: {
                quality: 'ASC',
            },
        });

        return equips.map((equip) => {
            const {
                id, name, icon, quality, category, tags,
            } = equip;
            return {
                id, name, icon, quality, category, tags,
            };
        });
    }

    public async findById(id: number): Promise<Equip> {
        const equip = await this.connection.manager.findOne(Equip, id, {
            relations: [
                'effect',
                'set',
                'set.equip',
                'set.setEffect',
                'set.setEffect.effect',
                'source',
                'source.boss',
                'source.boss.map',
                'source.reputation',
                'represent',
            ],
        });
        return equip;
    }

    public async findByIds(ids: number[]): Promise<Equip[]> {
        const equip = await this.connection.manager.find(Equip, {
            where: {
                id: In(ids),
            },
            relations: [
                'effect',
                'set',
                'set.equip',
                'set.setEffect',
                'set.setEffect.effect',
                'source',
                'source.boss',
                'source.boss.map',
                'source.reputation',
                'represent',
            ],
        });
        return equip;
    }
}
