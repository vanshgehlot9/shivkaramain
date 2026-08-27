import json

routing = {
    "CITY_SELECT": ["HOTEL_LIST_WITH_FILTER"],
    "HOTEL_LIST_WITH_FILTER": ["HOTEL_DETAIL"],
    "HOTEL_DETAIL": ["ROOM_SELECTION"],
    "ROOM_SELECTION": ["GUEST_AND_DATE_FORM"],
    "GUEST_AND_DATE_FORM": ["PAYMENT_METHOD"],
    "PAYMENT_METHOD": ["BOOKING_SUMMARY"],
    "BOOKING_SUMMARY": ["SUCCESS"],
    "SUCCESS": []
}

def build_flow():
    screens = [
        {
            "id": "CITY_SELECT",
            "title": "Select Destination",
            "data": {
                "city_options": {"type": "array", "items": {"type": "object", "properties": {"id": {"type": "string"}, "title": {"type": "string"}}}},
                "error_message": {"type": "string"},
                "has_error": {"type": "boolean"}
            },
            "layout": {
                "type": "SingleColumnLayout",
                "children": [
                    {"type": "Form", "name": "city_form", "children": [
                        {"type": "TextHeading", "text": "Hotel Booking"},
                        {"type": "TextSubheading", "text": "Select your destination"},
                        {"type": "Dropdown", "name": "city", "label": "City", "required": True, "data-source": "${data.city_options}"},
                        {"type": "TextBody", "text": "${data.error_message}", "visible": "${data.has_error}"},
                        {"type": "Footer", "label": "Search Hotels", "on-click-action": {"name": "data_exchange", "payload": {"city": "${form.city}"}}}
                    ]}
                ]
            }
        },
        {
            "id": "HOTEL_LIST_WITH_FILTER",
            "title": "Search Hotels",
            "data": {
                "city": {"type": "string"},
                "hotel_options": {"type": "array", "items": {"type": "object", "properties": {"id": {"type": "string"}, "title": {"type": "string"}, "description": {"type": "string"}}}},
                "hotel_count_label": {"type": "string"},
                "sort_options": {"type": "array", "items": {"type": "object", "properties": {"id": {"type": "string"}, "title": {"type": "string"}}}},
                "price_options": {"type": "array", "items": {"type": "object", "properties": {"id": {"type": "string"}, "title": {"type": "string"}}}},
                "amenity_options": {"type": "array", "items": {"type": "object", "properties": {"id": {"type": "string"}, "title": {"type": "string"}}}},
                "type_options": {"type": "array", "items": {"type": "object", "properties": {"id": {"type": "string"}, "title": {"type": "string"}}}},
                "rating_options": {"type": "array", "items": {"type": "object", "properties": {"id": {"type": "string"}, "title": {"type": "string"}}}},
                "booking_options": {"type": "array", "items": {"type": "object", "properties": {"id": {"type": "string"}, "title": {"type": "string"}}}},
                "error_message": {"type": "string"},
                "has_error": {"type": "boolean"}
            },
            "layout": {
                "type": "SingleColumnLayout",
                "children": [
                    {"type": "Form", "name": "hotel_list_form", "children": [
                        {"type": "TextHeading", "text": "Hotels in ${data.city}"},
                        {"type": "TextBody", "text": "${data.hotel_count_label}"},
                        {"type": "Dropdown", "name": "sort_by", "label": "Sort Options", "data-source": "${data.sort_options}", "required": False},
                        {"type": "CheckboxGroup", "name": "price_range", "label": "Price Range", "data-source": "${data.price_options}", "required": False},
                        {"type": "CheckboxGroup", "name": "amenities", "label": "Amenities", "data-source": "${data.amenity_options}", "required": False},
                        {"type": "CheckboxGroup", "name": "hotel_type", "label": "Hotel Type", "data-source": "${data.type_options}", "required": False},
                        {"type": "CheckboxGroup", "name": "rating", "label": "Guest Rating", "data-source": "${data.rating_options}", "required": False},
                        {"type": "CheckboxGroup", "name": "booking_type", "label": "Booking Type", "data-source": "${data.booking_options}", "required": False},
                        {"type": "TextSubheading", "text": "Select a Hotel"},
                        {"type": "RadioButtonsGroup", "name": "hotel_id", "label": "Available Hotels", "required": False, "data-source": "${data.hotel_options}"},
                        {"type": "TextBody", "text": "${data.error_message}", "visible": "${data.has_error}"},
                        {"type": "Footer", "label": "Apply Filters / View Details", "on-click-action": {
                            "name": "data_exchange", 
                            "payload": {
                                "city": "${data.city}", 
                                "hotel_id": "${form.hotel_id}",
                                "sort_by": "${form.sort_by}",
                                "price_range": "${form.price_range}",
                                "amenities": "${form.amenities}",
                                "hotel_type": "${form.hotel_type}",
                                "rating": "${form.rating}",
                                "booking_type": "${form.booking_type}"
                            }
                        }}
                    ]}
                ]
            }
        },
        {
            "id": "HOTEL_DETAIL",
            "title": "Hotel Details",
            "data": {
                "city": {"type": "string"},
                "hotel_id": {"type": "string"},
                "hotel_name": {"type": "string"},
                "hotel_image_url": {"type": "string"},
                "hotel_price_raw": {"type": "number"},
                "hotel_price_label": {"type": "string"},
                "hotel_rating": {"type": "string"},
                "hotel_location_label": {"type": "string"},
                "hotel_description": {"type": "string"},
                "hotel_amenities": {"type": "string"},
                "hotel_policies": {"type": "string"},
                "hotel_availability": {"type": "string"}
            },
            "layout": {
                "type": "SingleColumnLayout",
                "children": [
                    {"type": "Form", "name": "hotel_detail_form", "children": [
                        {"type": "Image", "src": "${data.hotel_image_url}", "height": 180, "scale-type": "cover"},
                        {"type": "TextHeading", "text": "${data.hotel_name}"},
                        {"type": "TextSubheading", "text": "${data.hotel_rating}"},
                        {"type": "TextBody", "text": "${data.hotel_location_label}"},
                        {"type": "TextBody", "text": "${data.hotel_price_label}"},
                        {"type": "TextBody", "text": "${data.hotel_availability}"},
                        {"type": "TextSubheading", "text": "About"},
                        {"type": "TextBody", "text": "${data.hotel_description}"},
                        {"type": "TextSubheading", "text": "Amenities"},
                        {"type": "TextBody", "text": "${data.hotel_amenities}"},
                        {"type": "TextSubheading", "text": "Policies"},
                        {"type": "TextBody", "text": "${data.hotel_policies}"},
                        {"type": "Footer", "label": "Select Room", "on-click-action": {
                            "name": "data_exchange", 
                            "payload": {
                                "hotel_id": "${data.hotel_id}", "city": "${data.city}", "hotel_name": "${data.hotel_name}",
                                "hotel_image_url": "${data.hotel_image_url}", "hotel_price_raw": "${data.hotel_price_raw}",
                                "hotel_rating": "${data.hotel_rating}"
                            }
                        }}
                    ]}
                ]
            }
        },
        {
            "id": "ROOM_SELECTION",
            "title": "Room Details",
            "data": {
                "city": {"type": "string"},
                "hotel_id": {"type": "string"},
                "hotel_name": {"type": "string"},
                "hotel_price_raw": {"type": "number"},
                "hotel_rating": {"type": "string"},
                "hotel_image_url": {"type": "string"},
                "img_room1": {"type": "string"},
                "img_room2": {"type": "string"},
                "img_room3": {"type": "string"},
                "room_options": {"type": "array", "items": {"type": "object", "properties": {"id": {"type": "string"}, "title": {"type": "string"}, "description": {"type": "string"}}}},
                "error_message": {"type": "string"},
                "has_error": {"type": "boolean"}
            },
            "layout": {
                "type": "SingleColumnLayout",
                "children": [
                    {"type": "Form", "name": "room_select_form", "children": [
                        {"type": "TextHeading", "text": "Select Room Type"},
                        {"type": "TextSubheading", "text": "1. Standard Room"},
                        {"type": "Image", "src": "${data.img_room1}", "height": 120, "scale-type": "cover"},
                        {"type": "TextSubheading", "text": "2. Premium Room"},
                        {"type": "Image", "src": "${data.img_room2}", "height": 120, "scale-type": "cover"},
                        {"type": "TextSubheading", "text": "3. Luxury Suite"},
                        {"type": "Image", "src": "${data.img_room3}", "height": 120, "scale-type": "cover"},
                        {"type": "RadioButtonsGroup", "name": "room_id", "label": "Available Rooms", "required": True, "data-source": "${data.room_options}"},
                        {"type": "TextBody", "text": "${data.error_message}", "visible": "${data.has_error}"},
                        {"type": "Footer", "label": "Continue Booking", "on-click-action": {
                            "name": "data_exchange",
                            "payload": {
                                "room_id": "${form.room_id}", "hotel_id": "${data.hotel_id}", "city": "${data.city}",
                                "hotel_name": "${data.hotel_name}", "hotel_image_url": "${data.hotel_image_url}",
                                "hotel_price_raw": "${data.hotel_price_raw}", "hotel_rating": "${data.hotel_rating}"
                            }
                        }}
                    ]}
                ]
            }
        },
        {
            "id": "GUEST_AND_DATE_FORM",
            "title": "Guest & Date Details",
            "data": {
                "city": {"type": "string"},
                "hotel_id": {"type": "string"},
                "hotel_name": {"type": "string"},
                "hotel_image_url": {"type": "string"},
                "hotel_price_raw": {"type": "number"},
                "hotel_rating": {"type": "string"},
                "room_id": {"type": "string"},
                "room_type": {"type": "string"},
                "room_price_modifier": {"type": "number"},
                "min_date": {"type": "string"},
                "guest_options": {"type": "array", "items": {"type": "object", "properties": {"id": {"type": "string"}, "title": {"type": "string"}}}},
                "child_options": {"type": "array", "items": {"type": "object", "properties": {"id": {"type": "string"}, "title": {"type": "string"}}}},
                "guest_name_prefill": {"type": "string"},
                "guest_phone_prefill": {"type": "string"},
                "hotel_summary_line": {"type": "string"},
                "error_message": {"type": "string"},
                "has_error": {"type": "boolean"}
            },
            "layout": {
                "type": "SingleColumnLayout",
                "children": [
                    {"type": "Form", "name": "guest_date_form", "init-values": {"guest_name": "${data.guest_name_prefill}", "guest_phone": "${data.guest_phone_prefill}", "num_children": "0"}, "children": [
                        {"type": "TextHeading", "text": "Booking Details"},
                        {"type": "TextSubheading", "text": "${data.hotel_summary_line}"},
                        {"type": "DatePicker", "name": "check_in_date", "label": "Check-in Date", "min-date": "${data.min_date}", "required": True},
                        {"type": "DatePicker", "name": "check_out_date", "label": "Check-out Date", "min-date": "${data.min_date}", "required": True},
                        {"type": "RadioButtonsGroup", "name": "num_guests", "label": "Adults", "required": True, "data-source": "${data.guest_options}"},
                        {"type": "RadioButtonsGroup", "name": "num_children", "label": "Children", "required": True, "data-source": "${data.child_options}"},
                        {"type": "TextInput", "name": "guest_name", "label": "Full Name", "input-type": "text", "required": True},
                        {"type": "TextInput", "name": "guest_email", "label": "Email Address", "input-type": "email", "required": False},
                        {"type": "TextInput", "name": "guest_phone", "label": "Phone Number", "input-type": "phone", "required": True},
                        {"type": "TextInput", "name": "special_requests", "label": "Special Requests", "input-type": "text", "required": False},
                        {"type": "TextBody", "text": "${data.error_message}", "visible": "${data.has_error}"},
                        {"type": "Footer", "label": "Proceed to Payment", "on-click-action": {
                            "name": "data_exchange",
                            "payload": {
                                "check_in_date": "${form.check_in_date}", "check_out_date": "${form.check_out_date}",
                                "num_guests": "${form.num_guests}", "num_children": "${form.num_children}",
                                "guest_name": "${form.guest_name}", "guest_email": "${form.guest_email}",
                                "guest_phone": "${form.guest_phone}", "special_requests": "${form.special_requests}",
                                "hotel_id": "${data.hotel_id}", "city": "${data.city}", "hotel_name": "${data.hotel_name}",
                                "hotel_image_url": "${data.hotel_image_url}", "hotel_price_raw": "${data.hotel_price_raw}",
                                "hotel_rating": "${data.hotel_rating}", "room_id": "${data.room_id}", "room_type": "${data.room_type}",
                                "room_price_modifier": "${data.room_price_modifier}"
                            }
                        }}
                    ]}
                ]
            }
        },
        {
            "id": "PAYMENT_METHOD",
            "title": "Payment Method",
            "data": {
                "city": {"type": "string"},
                "hotel_id": {"type": "string"},
                "hotel_name": {"type": "string"},
                "hotel_image_url": {"type": "string"},
                "hotel_price_raw": {"type": "number"},
                "hotel_rating": {"type": "string"},
                "room_id": {"type": "string"},
                "room_type": {"type": "string"},
                "room_price_modifier": {"type": "number"},
                "check_in_date": {"type": "string"},
                "check_out_date": {"type": "string"},
                "num_guests": {"type": "string"},
                "num_children": {"type": "string"},
                "guest_name": {"type": "string"},
                "guest_email": {"type": "string"},
                "guest_phone": {"type": "string"},
                "special_requests": {"type": "string"},
                "payment_options": {"type": "array", "items": {"type": "object", "properties": {"id": {"type": "string"}, "title": {"type": "string"}, "description": {"type": "string"}}}},
                "payment_summary_line": {"type": "string"}
            },
            "layout": {
                "type": "SingleColumnLayout",
                "children": [
                    {"type": "Form", "name": "payment_form", "children": [
                        {"type": "TextHeading", "text": "Payment Details"},
                        {"type": "TextBody", "text": "${data.payment_summary_line}"},
                        {"type": "RadioButtonsGroup", "name": "payment_method", "label": "Payment Method", "required": True, "data-source": "${data.payment_options}"},
                        {"type": "Footer", "label": "Review Booking", "on-click-action": {
                            "name": "data_exchange",
                            "payload": {
                                "payment_method": "${form.payment_method}", "hotel_id": "${data.hotel_id}", "city": "${data.city}",
                                "hotel_name": "${data.hotel_name}", "hotel_image_url": "${data.hotel_image_url}",
                                "hotel_price_raw": "${data.hotel_price_raw}", "hotel_rating": "${data.hotel_rating}",
                                "room_id": "${data.room_id}", "room_type": "${data.room_type}",
                                "room_price_modifier": "${data.room_price_modifier}", "check_in_date": "${data.check_in_date}",
                                "check_out_date": "${data.check_out_date}", "num_guests": "${data.num_guests}",
                                "num_children": "${data.num_children}", "guest_name": "${data.guest_name}",
                                "guest_email": "${data.guest_email}", "guest_phone": "${data.guest_phone}",
                                "special_requests": "${data.special_requests}"
                            }
                        }}
                    ]}
                ]
            }
        },
        {
            "id": "BOOKING_SUMMARY",
            "title": "Booking Summary",
            "data": {
                "city": {"type": "string"},
                "hotel_id": {"type": "string"},
                "hotel_name": {"type": "string"},
                "hotel_image_url": {"type": "string"},
                "hotel_price_raw": {"type": "number"},
                "hotel_rating": {"type": "string"},
                "room_id": {"type": "string"},
                "room_type": {"type": "string"},
                "room_price_modifier": {"type": "number"},
                "check_in_date": {"type": "string"},
                "check_out_date": {"type": "string"},
                "num_guests": {"type": "string"},
                "num_children": {"type": "string"},
                "guest_name": {"type": "string"},
                "guest_email": {"type": "string"},
                "guest_phone": {"type": "string"},
                "special_requests": {"type": "string"},
                "payment_method": {"type": "string"},
                "total_amount": {"type": "number"},
                "total_amount_display": {"type": "string"},
                "payment_method_label": {"type": "string"},
                "stay_summary": {"type": "string"},
                "guest_summary_label": {"type": "string"},
                "guest_name_label": {"type": "string"},
                "guest_phone_label": {"type": "string"},
                "price_breakdown_label": {"type": "string"}
            },
            "layout": {
                "type": "SingleColumnLayout",
                "children": [
                    {"type": "Form", "name": "summary_form", "children": [
                        {"type": "Image", "src": "${data.hotel_image_url}", "height": 160, "scale-type": "cover"},
                        {"type": "TextHeading", "text": "Confirm Booking"},
                        {"type": "TextSubheading", "text": "${data.hotel_name}"},
                        {"type": "TextBody", "text": "${data.stay_summary}"},
                        {"type": "TextBody", "text": "${data.guest_summary_label}"},
                        {"type": "TextBody", "text": "${data.guest_name_label}"},
                        {"type": "TextBody", "text": "${data.guest_phone_label}"},
                        {"type": "TextBody", "text": "${data.price_breakdown_label}"},
                        {"type": "TextSubheading", "text": "${data.total_amount_display}"},
                        {"type": "TextBody", "text": "${data.payment_method_label}"},
                        {"type": "Footer", "label": "Confirm & Book", "on-click-action": {
                            "name": "data_exchange",
                            "payload": {
                                "hotel_id": "${data.hotel_id}", "city": "${data.city}", "hotel_name": "${data.hotel_name}",
                                "hotel_image_url": "${data.hotel_image_url}", "hotel_price_raw": "${data.hotel_price_raw}",
                                "hotel_rating": "${data.hotel_rating}", "room_id": "${data.room_id}",
                                "room_type": "${data.room_type}", "room_price_modifier": "${data.room_price_modifier}",
                                "check_in_date": "${data.check_in_date}", "check_out_date": "${data.check_out_date}",
                                "num_guests": "${data.num_guests}", "num_children": "${data.num_children}",
                                "guest_name": "${data.guest_name}", "guest_email": "${data.guest_email}",
                                "guest_phone": "${data.guest_phone}", "special_requests": "${data.special_requests}",
                                "payment_method": "${data.payment_method}", "total_amount": "${data.total_amount}",
                                "total_amount_display": "${data.total_amount_display}"
                            }
                        }}
                    ]}
                ]
            }
        },
        {
            "id": "SUCCESS",
            "title": "Booking Confirmed",
            "terminal": True,
            "data": {
                "booking_id": {"type": "string"},
                "hotel_name": {"type": "string"},
                "check_in_date": {"type": "string"},
                "check_out_date": {"type": "string"},
                "total_amount_display": {"type": "string"},
                "payment_method_label": {"type": "string"},
                "payment_url": {"type": "string"},
                "payment_message": {"type": "string"},
                "guest_name": {"type": "string"},
                "extension_message_response": {"type": "object", "properties": {"params": {"type": "object", "properties": {"flow_token": {"type": "string"}}}}}
            },
            "layout": {
                "type": "SingleColumnLayout",
                "children": [
                    {"type": "Form", "name": "success_form", "children": [
                        {"type": "TextHeading", "text": "Booking Confirmed"},
                        {"type": "TextSubheading", "text": "Booking ID: ${data.booking_id}"},
                        {"type": "TextBody", "text": "Hotel: ${data.hotel_name}"},
                        {"type": "TextBody", "text": "Check-in: ${data.check_in_date}"},
                        {"type": "TextBody", "text": "Check-out: ${data.check_out_date}"},
                        {"type": "TextBody", "text": "Total: ${data.total_amount_display}"},
                        {"type": "TextBody", "text": "Payment: ${data.payment_method_label}"},
                        {"type": "TextBody", "text": "${data.payment_message}"},
                        {"type": "Footer", "label": "Done", "on-click-action": {
                            "name": "complete", "payload": {"flow_token": "${data.extension_message_response.params.flow_token}"}
                        }}
                    ]}
                ]
            }
        }
    ]

    out = {
        "version": "7.3",
        "data_api_version": "3.0",
        "routing_model": routing,
        "screens": screens
    }
    
    with open('/Users/vanshgehlot/hotelbot/flow_json/hotel_booking_flow.json', 'w') as f:
        json.dump(out, f, indent=2)

build_flow()
