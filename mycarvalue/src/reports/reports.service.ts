import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Report } from "./report.entity";
import { Repository } from "typeorm";
import { CreateReportDto } from "./dtos/create-report.dto";
import { User } from "src/users/user.entity";

@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

    create(reportDtoBody: CreateReportDto, user: User) {
        const report = this.repo.create(reportDtoBody);
        report.user = user;

        return this.repo.save(report);
    }
}
