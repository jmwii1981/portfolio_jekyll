export class ReadingTimeEstimator {
    static estimateReadingTime(content) {
        const words = content.split(/\s+/).length;
        return Math.ceil(words / 200);  // Average reading speed
    }
}