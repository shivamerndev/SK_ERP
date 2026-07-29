import { createSlice } from "@reduxjs/toolkit";

const getInitialDate = () => {
    try {
        return new Date().toISOString().split("T")[0];
    } catch (e) {
        return "";
    }
};

const purchaseSlice = createSlice({
    name: "purchase",
    initialState: {
        purchaseRecords: [],
        productsList: [],
        isLoading: false,
        purchaseForm: {
            supplierName: "",
            date: getInitialDate(),
            silverRate: 85000,
            oldBalanceFine: 0,
            oldBalanceAmount: 0,
            items: [
                {
                    sku: "",
                    productName: "",
                    quantity: 1,
                    weight: "",
                    less: "",
                    tunch: "92.5",
                    labRate: "",
                    labRateType: "PER_KG"
                }
            ],
            jamaDetails: [],
            cashJamaList: []
        }
    },
    reducers: {
        setPurchaseRecords: (state, { payload }) => {
            state.purchaseRecords = payload;
        },
        setProductsList: (state, { payload }) => {
            state.productsList = payload;
        },
        setIsLoading: (state, { payload }) => {
            state.isLoading = payload;
        },
        setPurchaseFormAction: (state, { payload }) => {
            state.purchaseForm = payload;
        }
    }
});

export const { setPurchaseRecords, setProductsList, setIsLoading, setPurchaseFormAction } = purchaseSlice.actions;
export default purchaseSlice.reducer;
