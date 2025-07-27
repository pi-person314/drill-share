const dropdownStyles = {
    placeholder: (base) => ({...base, color: "var(--muted)",}),
    control: (base) => ({...base, backgroundColor: "var(--secondary)", borderColor: "var(--text)"}),
    menu: (base) => ({...base, backgroundColor: "var(--secondary)"}),
    option: (base, state) => ({
        ...base, 
        backgroundColor: state.isFocused ? "var(--accent)" : "var(--secondary)", 
        color: "var(--text)",
        ":active": {backgroundColor: "var(--accent)"}
    }),
    singleValue: (base) => ({...base, color: "var(--text)"}),
    multiValue: (base) => ({...base, backgroundColor: "var(--primary)"}),
    multiValueLabel: (base) => ({...base, color: "var(--text)"})
}

export default dropdownStyles;