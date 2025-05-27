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
        "id": "ANOMALYDAY"
        , "name": "Anomaly Day Distribution"
        , "content": "Saturday morning and evening (after-party) distribution"
        , "title": "Anomaly Day Distribution"
        , "description": ""
        , "duration": 1
        , "dependency": {"type": "start-relative", "start-days-before": 0, "anchor": { "type": "anomaly-date" } }
        , "className": "spt-logistics"
        , "group": "Logistics"
        , "type": "range"
        , "style": ""
    }
    , {
        "id": "MISSIONDAY"
        , "name": "Mission Day Distribution"
        , "content": "Sunday distribution"
        , "title": "Mission Day Distribution"
        , "description": ""
        , "duration": 1
        , "dependency": {"type": "start-relative", "start-days-after": 1, "anchor": { "type": "event", "id": "ANOMALYDAY" } }
        , "className": "spt-logistics"
        , "group": "Logistics"
        , "type": "range"
        , "style": ""
    }
    , {
        "id": "PREPARTY"
        , "name": "Pre-Party Distribution"
        , "content": "Pre-Party distribution"
        , "title": "Pre-Party Distribution"
        , "description": ""
        , "duration": 1
        , "dependency": {"type": "start-relative", "start-days-before": 1, "anchor": { "type": "event", "id": "ANOMALYDAY" } }
        , "className": "spt-logistics"
        , "group": "Logistics"
        , "type": "range"
        , "style": ""
    }
    , {
        "id": "RECEIVING"
        , "name": "Receiving and Sorting and Bundling Product"
        , "content": "Receiving and Sorting and Bundling Product"
        , "title": "Receiving and Sorting and Bundling Product"
        , "description": ""
        , "duration": 5
        , "dependency": {"type": "start-relative", "start-days-before": 8, "anchor": { "type": "event", "id": "ANOMALYDAY" } }
        , "className": "spt-logistics"
        , "group": "Logistics"
        , "type": "range"
        , "style": ""
    }
    , {
        "id": "SHIPPING"
        , "name": "Shipping"
        , "content": "Shipping"
        , "title": "Shipping"
        , "description": ""
        , "duration": 7
        , "dependency": {"type": "start-relative", "start-days-after": 7, "anchor": { "type": "event", "id": "MISSIONDAY" } }
        , "className": "spt-logistics"
        , "group": "Logistics"
        , "type": "range"
        , "style": ""
    }
    , {
        "id": "ORDERDEADLINE_1WEEK"
        , "name": "Vendor order T-Shirts (1 week lead time items)"
        , "content": "Vendor order T-Shirts (1 week lead time items)"
        , "title": "Vendor order T-Shirts (1 week lead time items)"
        , "description": ""
        , "duration": 1
        , "dependency": {"type": "mid-relative", "start-days-before": 7, "anchor": { "type": "event", "id": "RECEIVING" } }
        , "className": "spt-production"
        , "group": "Production"
        , "type": "point"
        , "style": ""
    }
    , {
        "id": "COUNTSFINAL_1WEEK"
        , "name": "Shut off ECommerce/limit sales to order for T-Shirts"
        , "content": "Shut off ECommerce/limit sales to order for T-Shirts"
        , "title": "Shut off ECommerce/limit sales to order for T-Shirts"
        , "description": ""
        , "duration": 1
        , "dependency": {"type": "start-relative", "start-days-before": 1, "anchor": { "type": "event", "id": "ORDERDEADLINE_1WEEK" } }
        , "className": "spt-online"
        , "group": "StoreActions"
        , "type": "point"
        , "style": ""
    }
    , {
        "id": "DESIGNFINAL_1WEEK"
        , "name": "1 Week Items (Shirts)"
        , "content": "1 Week Items (Shirts)"
        , "title": "1 Week Items (Shirts)"
        , "description": ""
        , "duration": 5
        , "dependency": {"type": "start-relative", "start-days-before": 5, "anchor": { "type": "event", "id": "ORDERDEADLINE_1WEEK" } }
        , "className": "spt-design"
        , "group": "Design"
        , "type": "range"
        , "style": ""
    }
    , {
        "id": "ORDERDEADLINE_2WEEK"
        , "name": "Vendor order Patches (2 week lead time items)"
        , "content": "Vendor order Patches (2 week lead time items)"
        , "title": "Vendor order Patches (2 week lead time items)"
        , "description": ""
        , "duration": 1
        , "dependency": {"type": "mid-relative", "start-days-before": 14, "anchor": { "type": "event", "id": "RECEIVING" } }
        , "className": "spt-production"
        , "group": "Production"
        , "type": "point"
        , "style": ""
    }
    , {
        "id": "COUNTSFINAL_2WEEK"
        , "name": "Shut off ECommerce/limit sales to order for Patches (2 week lead time items)"
        , "content": "Shut off ECommerce/limit sales to order for Patches (2 week lead time items)"
        , "title": "Shut off ECommerce/limit sales to order for Patches (2 week lead time items)"
        , "description": ""
        , "duration": 1
        , "dependency": {"type": "start-relative", "start-days-before": 1, "anchor": { "type": "event", "id": "ORDERDEADLINE_2WEEK" } }
        , "className": "spt-online"
        , "group": "StoreActions"
        , "type": "point"
        , "style": ""
    }
    , {
        "id": "DESIGNFINAL_2WEEK"
        , "name": "2 Week Items (Patches)"
        , "content": "2 Week Items (Patches)"
        , "title": "2 Week Items (Patches)"
        , "description": ""
        , "duration": 5
        , "dependency": {"type": "start-relative", "start-days-before": 5, "anchor": { "type": "event", "id": "ORDERDEADLINE_2WEEK" } }
        , "className": "spt-design"
        , "group": "Design"
        , "type": "range"
        , "style": ""
    }
    , {
        "id": "ORDERDEADLINE_3WEEK"
        , "name": "Vendor order 3 week lead time items"
        , "content": "Vendor order 3 week lead time items"
        , "title": "Vendor order 3 week lead time items"
        , "description": ""
        , "duration": 1
        , "dependency": {"type": "mid-relative", "start-days-before": 21, "anchor": { "type": "event", "id": "RECEIVING" } }
        , "className": "spt-production"
        , "group": "Production"
        , "type": "point"
        , "style": ""
    }
    , {
        "id": "COUNTSFINAL_3WEEK"
        , "name": "Shut off ECommerce/limit sales to order for 3 week lead time items"
        , "content": "Shut off ECommerce/limit sales to order for 3 week lead time items"
        , "title": "Shut off ECommerce/limit sales to order for 3 week lead time items"
        , "description": ""
        , "duration": 1
        , "dependency": {"type": "start-relative", "start-days-before": 1, "anchor": { "type": "event", "id": "ORDERDEADLINE_3WEEK" } }
        , "className": "spt-online"
        , "group": "StoreActions"
        , "type": "point"
        , "style": ""
    }
    , {
        "id": "DESIGNFINAL_3WEEK"
        , "name": "3 Week Items"
        , "content": "3 Week Items"
        , "title": "3 Week Items"
        , "description": ""
        , "duration": 5
        , "dependency": {"type": "start-relative", "start-days-before": 5, "anchor": { "type": "event", "id": "ORDERDEADLINE_3WEEK" } }
        , "className": "spt-design"
        , "group": "Design"
        , "type": "range"
        , "style": ""
    }
    , {
        "id": "ORDERDEADLINE_BADGES"
        , "name": "Vendor order badges"
        , "content": "Vendor order badges"
        , "title": "Vendor order badges"
        , "description": ""
        , "duration": 1
        , "dependency": {"type": "mid-relative", "start-days-before": 21, "anchor": { "type": "event", "id": "RECEIVING" } }
        , "className": "spt-production"
        , "group": "Production"
        , "type": "point"
        , "style": ""
    }
    , {
        "id": "COUNTSFINAL_BADGES"
        , "name": "Finalize agent name data for badges"
        , "content": "Finalize agent name data for badges"
        , "title": "Finalize agent name data for badges"
        , "description": ""
        , "duration": 1
        , "dependency": {"type": "start-relative", "start-days-before": 1, "anchor": { "type": "event", "id": "ORDERDEADLINE_BADGES" } }
        , "className": "spt-production"
        , "group": "Production"
        , "type": "point"
        , "style": ""
    }
    , {
        "id": "DESIGNFINAL_BADGES"
        , "name": "Badges"
        , "content": "Badges"
        , "title": "Badges"
        , "description": ""
        , "duration": 5
        , "dependency": {"type": "start-relative", "start-days-before": 5, "anchor": { "type": "event", "id": "ORDERDEADLINE_BADGES" } }
        , "className": "spt-design"
        , "group": "Design"
        , "type": "range"
        , "style": ""
    }
    , {
        "id": "SITEUP_ALL"
        , "name": "All Items Available (Pre-Order)"
        , "content": "All Items Available (Pre-Order)"
        , "title": "All Items Available (Pre-Order)"
        , "duration": 21
        , "dependency": {"type": "start-relative", "start-days-before": 21, "anchor": { "type": "event", "id": "COUNTSFINAL_3WEEK" } }
        , "className": "spt-online"
        , "group": "Logistics"
        , "type": "range"
        , "style": "color: DarkGreen; background-color: DarkSeaGreen;"
        , "comments": "3 week of unlimited sales"
    }
    , {
        "id": "STORESETUP"
        , "name": "Store setup"
        , "content": "Store setup"
        , "title": "Create items in store, setup up bundles and pricing"
        , "duration": 10
        , "dependency": {"type": "start-relative", "start-days-before": 10, "anchor": { "type": "event", "id": "SITEUP_ALL" } }
        , "className": "spt-online"
        , "group": "StoreActions"
        , "type": "range"
        , "style": ""
        , "comments": "Starts 10 days before ecommerce is up, ends when ecommerce needs to be up"
    }
    , {
        "id": "MOCKUPS_NEEDED"
        , "name": "Store Mockups"
        , "content": "Store Mockups"
        , "title": "Close to final design but do not have to be ready for the particular media."
        , "description": ""
        , "duration": 5
        , "dependency": {"type": "start-relative", "start-days-before": 5, "anchor": { "type": "event", "id": "SITEUP_ALL" } }
        , "className": "spt-design"
        , "group": "Design"
        , "type": "range"
        , "style": ""
        , "comments": "Starts 5 days before ecommerce is up, ends when ecommerce needs to be up"
    }
    , {
        "id": "SITEUP_REDUCED"
        , "name": "Items only available based on order quantities and sales"
        , "content": "Items only available based on order quantities and sales"
        , "title": "Items only available based on order quantities and sales"
        , "duration": 21
        , "dependency": {"type": "end-relative", "start-days-before": 0, "anchor": { "type": "event", "id": "SITEUP_ALL" } }
        , "className": "spt-online"
        , "group": "Logistics"
        , "type": "range"
        , "style": "color: red; background-color: pink;"
    }
    , {
        "id": "RESEARCH"
        , "name": "Product Design, selection, vendor contact, quotes, nail down lead times"
        , "content": "Product Design, selection, vendor contact, quotes, nail down lead times"
        , "title": "Product Design, selection, vendor contact, quotes, nail down lead times"
        , "duration": 28
        , "dependency": {"type": "start-relative", "start-days-before": 28, "anchor": { "type": "event", "id": "SITEUP_ALL" } }
        , "className": "spt-production"
        , "group": "Production"
        , "type": "range"
        , "style": ""
    }
    , {
        "id": "MARKETINGOPEN"
        , "name": "Announce store"
        
        , "duration": 1
        , "dependency": {"type": "start-relative", "start-days-before": 0, "anchor": { "type": "event", "id": "SITEUP_ALL" } }
        , "className": "spt-marketing"
        , "group": "Marketing"
        , "type": "point"
        , "style": ""
    }
    , {
        "id": "MARKETINGREMINDER"
        , "name": "Reminder"
        
        , "duration": 1
        , "dependency": {"type": "start-relative", "start-days-after": 7, "anchor": { "type": "event", "id": "SITEUP_ALL" } }
        , "className": "spt-marketing"
        , "group": "Marketing"
        , "type": "point"
        , "style": ""
    }
    , {
        "id": "MARKETINGLASTCHANGE3"
        , "name": "Last chance for 3 week items as counts being finalized"
        , "duration": 1
        , "dependency": {"type": "start-relative", "start-days-after": 14, "anchor": { "type": "event", "id": "SITEUP_ALL" } }
        , "className": "spt-marketing"
        , "group": "Marketing"
        , "type": "point"
        , "style": ""
    }
    , {
        "id": "MARKETINGLASTCHANGE2"
        , "name": "Last chance for 2 week items as counts being finalized"
        , "duration": 1
        , "dependency": {"type": "start-relative", "start-days-after": 21, "anchor": { "type": "event", "id": "SITEUP_ALL" } }
        , "className": "spt-marketing"
        , "group": "Marketing"
        , "type": "point"
        , "style": ""
    }
    , {
        "id": "MARKETINGLASTCHANGE1"
        , "name": "Last chance for 1 week items as counts being finalized"
        , "duration": 1
        , "dependency": {"type": "start-relative", "start-days-after": 28, "anchor": { "type": "event", "id": "SITEUP_ALL" } }
        , "className": "spt-marketing"
        , "group": "Marketing"
        , "type": "point"
        , "style": ""
    }
];

const swag = { events: events, groups: groups };