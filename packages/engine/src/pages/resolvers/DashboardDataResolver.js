export default class DashboardDataResolver {

    static metricValue(
        metricKey,
        data = {}
    ) {
        return data?.metrics?.[metricKey] ?? 0;
    }

    static widgetData(
        widgetKey,
        data = {}
    ) {
        return data?.widgets?.[widgetKey] ?? null;
    }

}