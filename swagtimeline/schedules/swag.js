const groups = [
    { id: 'Design', content: 'Design deadlines'}
    , { id: 'StoreActions', content: 'Store actions'}
    , { id: 'Production', content: 'Production'}
    , { id: 'Logistics', content: 'Logistics'}
    , { id: 'Marketing', content: 'Marketing'}
]
;

const events = [
    {
        "id": 1
        , "handle": "RESEARCH"
        , "name": "Product Design, selection, vendor contact, quotes, nail down lead times"
        , "description": ""
        , "start-days-before": 60
        , "end-days-before": 40
        , "dependency": "End date is from MOCKUPS_NEEDED"
        , "class-name": "spt-production"
        , "group": "Production"
        , "type": "range"
        , "style": ""
    }
    , {
        "id": 2
        , "handle": "MOCKUPS_NEEDED"
        , "name": "Store Mockups"
        , "title": "Close to final design but do not have to be ready for the particular media."
        , "description": ""
        , "start-days-before": 45
        , "end-days-before": 40
        , "dependency": "Starts 5 days before ecommerce is up, ends when ecommerce needs to be up"
        , "class-name": "spt-design"
        , "group": "Design"
        , "type": "range"
        , "style": ""
    }
    , {
        "id": 3
        , "handle": "SITEUP_ALL"
        , "name": "All Items Available (Pre-Order)"
        , "description": ""
        , "start-days-before": 40
        , "end-days-before": 26
        , "dependency": ""
        , "class-name": "spt-online"
        , "group": "Logistics"
        , "type": "range"
        , "style": "color: DarkGreen; background-color: DarkSeaGreen;"
    }
    , {
        "id": 4
        , "handle": "STORESETUP"
        , "name": "Store setup"
        , "title": "Create items in store, setup up bundles and pricing"
        , "description": ""
        , "start-days-before": 50
        , "end-days-before": 40
        , "dependency": "Starts 5 days before ecommerce is up, ends when ecommerce needs to be up"
        , "class-name": "spt-online"
        , "group": "StoreActions"
        , "type": "range"
        , "style": ""
    }
    , {
        "id": 5
        , "handle": "DESIGNDEADLINE_3WEEK"
        , "name": "3 Week Items"
        , "description": ""
        , "start-days-before": 33
        , "end-days-before": 29
        , "dependency": ""
        , "class-name": "spt-design"
        , "group": "Design"
        , "type": "range"
        , "style": ""
    }
    , {
        "id": 6
        , "handle": "COUNTSFINAL_3WEEK"
        , "name": "Shut off ECommerce/limit sales to order for 3 week items"
        , "description": ""
        , "start-days-before": 26
        , "end-days-before": 26
        , "dependency": ""
        , "class-name": "spt-online"
        , "group": "StoreActions"
        , "type": "point"
        , "style": ""
    }
    , {
        "id": 7
        , "handle": "DESIGNDEADLINE_2WEEK"
        , "name": "2 Week Items (Patches)"
        , "description": ""
        , "start-days-before": 26
        , "end-days-before": 22
        , "dependency": ""
        , "class-name": "spt-design"
        , "group": "Design"
        , "type": "range"
        , "style": ""
    }
    , {
        "id": 8
        , "handle": "ORDERDEADLINE_3WEEK"
        , "name": "Last Time to Order 3 week lead time items"
        , "description": ""
        , "start-days-before": 25
        , "end-days-before": 24
        , "dependency": ""
        , "class-name": "spt-production"
        , "group": "Production"
        , "type": "point"
        , "style": ""
    }
    , {
        "id": 9
        , "handle": "COUNTSFINAL_2WEEK"
        , "name": "Shut off ECommerce/limit sales to order for Patches"
        , "description": ""
        , "start-days-before": 19
        , "end-days-before": 19
        , "dependency": ""
        , "class-name": "spt-online"
        , "group": "StoreActions"
        , "type": "point"
        , "style": ""
    }
    , {
        "id": 10
        , "handle": "DESIGNDEADLINE_2WEEK"
        , "name": "1 Week Items (Shirts)"
        , "description": ""
        , "start-days-before": 18
        , "end-days-before": 14
        , "dependency": ""
        , "class-name": "spt-design"
        , "group": "Design"
        , "type": "range"
        , "style": ""
    }
    , {
        "id": 11
        , "handle": "ORDERDEADLINE_2WEEK"
        , "name": "Last Time to Order Patches (2 week lead time items)"
        , "description": ""
        , "start-days-before": 18
        , "end-days-before": 17
        , "dependency": ""
        , "class-name": "spt-production"
        , "group": "Production"
        , "type": "point"
        , "style": ""
    }
    , {
        "id": 12
        , "handle": "COUNTSFINAL_1WEEK"
        , "name": "Shut off ECommerce/limit sales to order for T-Shirts"
        , "description": ""
        , "start-days-before": 12
        , "end-days-before": 12
        , "dependency": ""
        , "class-name": "spt-online"
        , "group": "StoreActions"
        , "type": "point"
        , "style": ""
    }
    , {
        "id": 13
        , "handle": "ORDERDEADLINE_1WEEK"
        , "name": "Last Time to Order T-Shirts (1 week lead time items)"
        , "description": ""
        , "start-days-before": 11
        , "end-days-before": 10
        , "dependency": ""
        , "class-name": "spt-production"
        , "group": "Production"
        , "type": "point"
        , "style": ""
    }
    , {
        "id": 14
        , "handle": "RECEIVING"
        , "name": "Receiving and Sorting and Bundling Product"
        , "description": ""
        , "start-days-before": 8
        , "end-days-before": 3
        , "dependency": ""
        , "class-name": "spt-logistics"
        , "group": "Logistics"
        , "type": "range"
        , "style": ""
    }
    , {
        "id": 15
        , "handle": "FRIDAYDISTRO"
        , "name": "Friday Evening Distribution"
        , "description": ""
        , "start-days-before": 1
        , "end-days-before": 1
        , "dependency": ""
        , "class-name": "spt-logistics"
        , "group": "Logistics"
        , "type": "range"
        , "style": ""
    }
    , {
        "id": 16
        , "handle": "SATURDAYDISTRO"
        , "name": "Saturday Morning and Evening Distribution"
        , "description": ""
        , "start-days-before": 0
        , "end-days-before": 0
        , "dependency": ""
        , "class-name": "spt-logistics"
        , "group": "Logistics"
        , "type": "range"
        , "style": ""
    }
    , {
        "id": 17
        , "handle": "SUNDAYDISTRO"
        , "name": "Sunday Distribution"
        , "description": ""
        , "start-days-before": -1
        , "end-days-before": -1
        , "dependency": ""
        , "class-name": "spt-logistics"
        , "group": "Logistics"
        , "type": "range"
        , "style": ""
    }
    , {
        "id": 18
        , "handle": "SHIPPING"
        , "name": "Shipping"
        , "description": ""
        , "start-days-before": -9
        , "end-days-before": -16
        , "dependency": ""
        , "class-name": "spt-logistics"
        , "group": "Logistics"
        , "type": "range"
        , "style": ""
    }
    , {
        "id": 19
        , "handle": "SITEUP_REDUCED"
        , "name": "Items only available based on order quantities and sales"
        , "description": ""
        , "start-days-before": 26
        , "end-days-before": -16
        , "dependency": ""
        , "class-name": "spt-online"
        , "group": "Logistics"
        , "type": "range"
        , "style": "color: red; background-color: pink;"
    }
    , {
        "id": 20
        , "handle": "MARKETINGOPEN"
        , "name": "Announce store"
        , "description": ""
        , "start-days-before": 40
        , "end-days-before": 40
        , "dependency": ""
        , "class-name": "spt-marketing"
        , "group": "Marketing"
        , "type": "point"
        , "style": ""
    }
    , {
        "id": 21
        , "handle": "MARKETINGREMINDER"
        , "name": "Reminder"
        , "description": ""
        , "start-days-before": 33
        , "end-days-before": 33
        , "dependency": ""
        , "class-name": "spt-marketing"
        , "group": "Marketing"
        , "type": "point"
        , "style": ""
    }
    , {
        "id": 22
        , "handle": "MARKETINGLASTCHANGE"
        , "name": "Last chance as counts being finalized"
        , "description": ""
        , "start-days-before": 26
        , "end-days-before": 26
        , "dependency": ""
        , "class-name": "spt-marketing"
        , "group": "Marketing"
        , "type": "point"
        , "style": ""
    }
]
;

const swag = { events: events, groups: groups };