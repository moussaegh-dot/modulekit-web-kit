import api from "../api/apiClient";

class RelationService {

    async options(
        resource,
        {
            search = null,
            limit = 100,
            labelColumn = null,
            valueColumn = null,
        } = {}
    ) {

        const params = {
            limit,
        };

        if (search) {
            params.search = search;
        }

        if (labelColumn) {
            params.label_column = labelColumn;
        }

        if (valueColumn) {
            params.value_column = valueColumn;
        }

        const { data } = await api.get(
            `/api/${resource}/options`,
            { params }
        );

        return data;
    }
}

export default new RelationService();