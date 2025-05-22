const events = [
    {
        "id": 1
        , "handle": "RESEARCH"
        , "name": "Product Design, selection, vendor contact, quotes, nail down lead times"
        , "description": ""
        , "start-days-before": 90
        , "end-days-before": 40
        , "dependency": "End date is from MOCKUPS_NEEDED"
        , "class-name": "spt-production"
        , "group": "Production"
        , "type": "range"
    }
    , {
        "id": 2
        , "handle": "MOCKUPS_NEEDED"
        , "name": "Finalize Design Mockups for ECommerce Site"
        , "description": ""
        , "start-days-before": 45
        , "end-days-before": 40
        , "dependency": "Starts 5 days before ecommerce is up, ends when ecommerce needs to be up"
        , "class-name": "spt-design"
        , "group": "Design"
        , "type": "range"
    }
    , {
        "id": 3
        , "handle": ""
        , "name": "Ecommerce Site Up and Running For All Items"
        , "description": ""
        , "start-days-before": 40
        , "end-days-before": 26
        , "dependency": ""
        , "class-name": "spt-online"
        , "group": "Store"
        , "type": "range"
    }
    , {
        "id": 4
        , "handle": ""
        , "name": "Ecommerce Site Up and Running"
        , "description": ""
        , "start-days-before": 40
        , "end-days-before": 12
        , "dependency": ""
        , "class-name": "spt-online"
        , "group": "Store"
        , "type": "range"
    }
    , {
        "id": 5
        , "handle": ""
        , "name": "Finalize Production Designs For 3 Week Items"
        , "description": ""
        , "start-days-before": 33
        , "end-days-before": 29
        , "dependency": ""
        , "class-name": "spt-design"
        , "group": "Design"
        , "type": "range"
    }
    , {
        "id": 6
        , "handle": ""
        , "name": "Shut off ECommerce for 3 week items"
        , "description": ""
        , "start-days-before": 26
        , "end-days-before": 26
        , "dependency": ""
        , "class-name": "spt-online"
        , "group": "Store"
        , "type": "point"
    }
    , {
        "id": 7
        , "handle": ""
        , "name": "Finalize Production Designs For 2 Week Items (Patches)"
        , "description": ""
        , "start-days-before": 26
        , "end-days-before": 22
        , "dependency": ""
        , "class-name": "spt-design"
        , "group": "Design"
        , "type": "range"
    }
    , {
        "id": 8
        , "handle": ""
        , "name": "Last Time to Order 3 week lead time items"
        , "description": ""
        , "start-days-before": 25
        , "end-days-before": 24
        , "dependency": ""
        , "class-name": "spt-production"
        , "group": "Production"
        , "type": "point"
    }
    , {
        "id": 9
        , "handle": ""
        , "name": "Shut off ECommerce for Patches"
        , "description": ""
        , "start-days-before": 19
        , "end-days-before": 19
        , "dependency": ""
        , "class-name": "spt-online"
        , "group": "Store"
        , "type": "point"
    }
    , {
        "id": 10
        , "handle": ""
        , "name": "Finalize Production Designs For 1 Week Items (Shirts)"
        , "description": ""
        , "start-days-before": 18
        , "end-days-before": 14
        , "dependency": ""
        , "class-name": "spt-design"
        , "group": "Design"
        , "type": "range"
    }
    , {
        "id": 11
        , "handle": ""
        , "name": "Last Time to Order Patches (2 week lead time items)"
        , "description": ""
        , "start-days-before": 18
        , "end-days-before": 17
        , "dependency": ""
        , "class-name": "spt-production"
        , "group": "Production"
        , "type": "point"
    }
    , {
        "id": 12
        , "handle": ""
        , "name": "Shut off ECommerce for T-Shirts"
        , "description": ""
        , "start-days-before": 12
        , "end-days-before": 12
        , "dependency": ""
        , "class-name": "spt-online"
        , "group": "Store"
        , "type": "point"
    }
    , {
        "id": 13
        , "handle": ""
        , "name": "Last Time to Order T-Shirts (1 week lead time items)"
        , "description": ""
        , "start-days-before": 11
        , "end-days-before": 10
        , "dependency": ""
        , "class-name": "spt-production"
        , "group": "Production"
        , "type": "point"
    }
    , {
        "id": 14
        , "handle": ""
        , "name": "Receiving and Sorting and Bundling Product"
        , "description": ""
        , "start-days-before": 8
        , "end-days-before": 3
        , "dependency": ""
        , "class-name": "spt-logistics"
        , "group": "Logistics"
        , "type": "range"
    }
    , {
        "id": 15
        , "handle": ""
        , "name": "Friday Evening Distribution"
        , "description": ""
        , "start-days-before": 1
        , "end-days-before": 1
        , "dependency": ""
        , "class-name": "spt-logistics"
        , "group": "Logistics"
        , "type": "range"
    }
    , {
        "id": 16
        , "handle": ""
        , "name": "Saturday Morning and Evening Distribution"
        , "description": ""
        , "start-days-before": 0
        , "end-days-before": 0
        , "dependency": ""
        , "class-name": "spt-logistics"
        , "group": "Logistics"
        , "type": "range"
    }
    , {
        "id": 17
        , "handle": ""
        , "name": "Sunday Distribution"
        , "description": ""
        , "start-days-before": -1
        , "end-days-before": -1
        , "dependency": ""
        , "class-name": "spt-logistics"
        , "group": "Logistics"
        , "type": "range"
    }
]
;

const groups = [
    { id: 'Design', content: 'Design'}
    , { id: 'Store', content: 'Store'}
    , { id: 'Production', content: 'Production'}
    , { id: 'Logistics', content: 'Logistics'}
]
;

export default { events: events, groups: groups };