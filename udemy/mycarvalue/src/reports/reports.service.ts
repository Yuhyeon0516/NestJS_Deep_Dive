import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Report } from "./report.entity";
import { Repository } from "typeorm";
import { CreateReportDto } from "./dtos/create-report.dto";
import { User } from "src/users/user.entity";
import { GetEstimateDto } from "./dtos/get-estimate.dto";

@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

    create(reportDtoBody: CreateReportDto, user: User) {
        const report = this.repo.create(reportDtoBody);
        report.user = user;

        return this.repo.save(report);
    }

    async changeApproval(id: string, approved: boolean) {
        const report = await this.repo.findOne({ where: { id: parseInt(id) } });

        if (!report) {
            throw new NotFoundException("게시물을 찾을 수 없습니다.");
        }

        report.approved = approved;

        return this.repo.save(report);
    }

    createEstimate(estimateDto: GetEstimateDto) {
        return this.repo
            .createQueryBuilder()
            .select("AVG(price)", "price")
            .where("make = :make", { make: estimateDto.make })
            .andWhere("model = :model", { model: estimateDto.model })
            .andWhere("lng - :lng BETWEEN -5 AND 5", { lng: estimateDto.lng })
            .andWhere("lat - :lat BETWEEN -5 AND 5", { lat: estimateDto.lat })
            .andWhere("year - :year BETWEEN -3 AND 3", {
                year: estimateDto.year,
            })
            .orderBy("ABS(mile - :mile)", "DESC")
            .setParameters({ mile: estimateDto.mile })
            .limit(3)
            .getRawOne();
    }
}
