const dropdownStyles = {
    placeholder: (base: any) => ({...base, color: "var(--muted)",}),
    control: (base: any) => ({...base, backgroundColor: "var(--secondary)", borderColor: "var(--text)"}),
    menu: (base: any) => ({...base, backgroundColor: "var(--secondary)"}),
    option: (base: any, state: any) => ({
        ...base, 
        backgroundColor: state.isFocused ? "var(--accent)" : "var(--secondary)", 
        color: "var(--text)",
        ":active": {backgroundColor: "var(--accent)"}
    }),
    singleValue: (base: any) => ({...base, color: "var(--text)"}),
    multiValue: (base: any) => ({...base, backgroundColor: "var(--primary)"}),
    multiValueLabel: (base: any) => ({...base, color: "var(--text)"})
}

export default dropdownStyles;