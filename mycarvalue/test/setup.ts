import { rm } from "fs/promises";
import { join } from "path";

global.beforeEach(async () => {
    try {
        await rm(join(__dirname, "..", "test.sqlite"));
    } catch (error) {
        console.log("Test DB가 없습니다.");
    }
});
