<div>
    {% if isOrphaned %}
        <p><strong>Ophaned Content.</strong></p>
    {% else %}
        <p><strong class='bb5-alert'>Warning,</strong></p>
        <p class='bb5-alert'>are you sure you want to delete this item?</p>
        <div data-content-page=''><p><strong>This content is being used on the following pages :</strong></p>
            <div class='bb5-dialog-overflow-y'>
                <ul class='contents'>
                    {% for item in items %}
                        <li class='page-title'>{{item.title}}</li>
                    {% endfor %}
                </ul>
            </div>
        </div>
    {% endif %}
</div>